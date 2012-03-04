/* 
 * Stage class
 */

//STAGE CLASS
//constructor and initialization
var Stage = function() {
    //init properties
    this.selectedObject = null;
    this.selectedFill = '#FFFFFF';
    this.selectedStroke = '#000000';

    //state of stage
    this.state = '';
    this.start_x = 0;
    this.start_y = 0;

    //init main layer
    this.layer = new Layer("edit_area");
    this.layer.setFps(24);
    this.stageWidth = this.layer.canvas.width;
    this.stageHeight = this.layer.canvas.height;
    this.transformBox = null;
    
    //set canvas events
    this.layer.canvas.addEventListener(MouseEvent.DOWN, this.stageMouseDown, false);
    this.layer.canvas.addEventListener(MouseEvent.UP, this.stageMouseUp, false);
    this.layer.canvas.addEventListener(MouseEvent.MOVE, this.stageMouseMove, false);
    this.layer.canvas.addEventListener(MouseEvent.OUT, this.stageMouseUp, false);
}

//add object to stage, set its base events and push it to objects array
Stage.prototype.addObject = function(obj) {
    //add to stage
    obj.zoom = 0; //add zoom property
    stage.layer.addObject(obj);
    
    //add events
    obj.draggable();
    obj.addEventListener('mousedown', function(e) {
        stage.selectedStroke = e.target.color.stroke;
        stage.selectedFill = e.target.color.fill;
        stage.transformBox.apply(e.target);
    });
}

//remove object and its events
Stage.prototype.removeObject = function(obj) {
    stage.layer.removeObject(obj);
}

//clear all objects and reset stage
Stage.prototype.clear = function() {
    this.state = '';
    this.transformBox.unset();
    this.layer.clear();
}

//stage mouse down
Stage.prototype.stageMouseDown = function(e) {
    //console.log('stage mouseDown', stage.state);
    var mx = e.pageX - stage.layer.canvas.offsetLeft;
    var my = e.pageY - stage.layer.canvas.offsetTop;

    //new rectangle
    if (stage.state == 'newRect') {
        var r = new Rectangle(new Point(mx, my), new Point(mx + 1, my + 1)).toPolygon();
        stage.selectedObject = new Shaper("newRect", r, {stroke:stage.selectedStroke, fill:stage.selectedFill});
        stage.addObject(stage.selectedObject);
        
        stage.start_x = mx;
        stage.start_y = my;
        stage.state = 'drawingRect';
        
    //new arrow
    } else if (stage.state == 'newArrow') {
        var r = createArrow();
        r.move(mx, my);
        stage.selectedObject = new Shaper("newArrow", r, {stroke:stage.selectedStroke, fill:stage.selectedFill});
        stage.addObject(stage.selectedObject);
        
        stage.start_x = mx;
        stage.start_y = my;
        stage.state = 'drawingRect';
        
    //clear selection
    } else if (!stage.layer.getObjectUnderPoint({x:mx, y:my})) stage.transformBox.unset();
    
}

//stage mouse move
Stage.prototype.stageMouseMove = function(e) {
    //console.log('stage mouseMove', stage.state);
    var mx = e.pageX - stage.layer.canvas.offsetLeft;
    var my = e.pageY - stage.layer.canvas.offsetTop;

    //rotation
    if (stage.state == 'rotateObj') {
        var trBox = stage.transformBox;
        var c = trBox.getCenter();
        var a1 = trBox.rotatePoint.angleTo(c);
        var a2 = new Point(mx, my).angleTo(c);
        trBox.rotate(a2 - a1, c, true);
        
    //new rectangle
    } else if (stage.state == 'drawingRect') {
        var r = new Rectangle(new Point(stage.start_x, stage.start_y), new Point(mx, my));
        r.normalize();
        
        stage.selectedObject.shape.placeIntoRect(r);
        stage.layer.forceRedraw();
    }
}

//stage mouse up
Stage.prototype.stageMouseUp = function(e) {
    //console.log('stage mouseUp', stage.state);
    
    //new rectangle
    if (stage.state == 'drawingRect') {
        stage.transformBox.apply(stage.selectedObject);
        
    //rotation
    } else if (stage.state == 'rotateObj') stage.transformBox.updateRects();

    stage.state = '';
}