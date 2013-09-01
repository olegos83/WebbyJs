/*
 * ObjGroup by OlegoS, 10 Apr 2013
 *
 * A group of objects implementation.
 */


//ANONYMOUS FUNCTION WRAPPER
( function() {
//PRIVATE
	
	
//CONSTRUCTOR
	/**
	 * ObjGroup allows manipulations with many objects.
	 * 
	 * @class ObjGroup
	 * @author OlegoS
	 *
	 * @constructor
	 * @param {String} id - group id. Default is "".
	 * @param {Array} objects - objects to add. Can be array or one object.
	 **/
	var ObjGroup = function(id, objects) {
	   /**
	    * Group id.
	    * 
	    * @property id
	    * @type String
	    **/
		this.id = (id == null ? '' : id);
		
	   /**
	    * Objects data provider.
	    * 
	    * @property objects
	    * @type DataProvider
	    **/
		if (!objects) objects = [];
		if (objects instanceof Array) this.objects = new DataProvider(objects); else this.objects = new DataProvider([objects]);
	}
	
	
//STATIC
	
	
//PROTOTYPE
	//get prototype reference
	var p = ObjGroup.prototype;
	
	/**
	 * Get bounding rectangle.
	 * 
	 * @method getBoundRect
	 * 
	 * @return {Rectangle} - bounding rectangle.
	 **/
	p.getBoundRect = function() {
		var objs = this.objects.data, tp = new Path(), tp_pt = tp.points.data;
		
		for (var i = 0, l = objs.length; i < l; i++) {
			var r = objs[i].getBoundRect();
			if (r) tp_pt.push(r.from, r.to);
		}
		
		return tp.getBoundRect();
	}

	/**
	 * Get center point.
	 * 
	 * @method getCenter
	 * 
	 * @return {Point} - center point.
	 **/
	p.getCenter = function() {
	    return this.getBoundRect().getCenter();
	}

	/**
	 * Move by x/y deltas.
	 * 
	 * @method move
	 * @param {Number} dx - X delta.
	 * @param {Number} dy - Y delta.
	 **/
	p.move = function(dx, dy) {
		var objs = this.objects.data;
		for (var i = 0, l = objs.length; i < l; i++) objs[i].move(dx, dy);
	}

	/**
	 * Scale from pivot.
	 * 
	 * @method scale
	 * @param {Number} scX - x scale koef.
	 * @param {Number} scY - y scale koef.
	 * @param {Point} pivot - pivot to scale from.
	 **/
	p.scale = function(scX, scY, pivot) {
		var objs = this.objects.data;
		for (var i = 0, l = objs.length; i < l; i++) objs[i].scale(scX, scY, pivot);
	}

	/**
	 * Rotate around pivot.
	 * 
	 * @method rotate
	 * @param {Number} angle - rotation angle (in radians).
	 * @param {Point} pivot - pivot to rotate around.
	 **/
	p.rotate = function(angle, pivot) {
		var objs = this.objects.data;
		for (var i = 0, l = objs.length; i < l; i++) objs[i].rotate(angle, pivot);
	}

	/**
	 * Apply matrix transformation.
	 * 
	 * @method matrixTransform
	 * @param {Matrix} m - matrix.
	 **/
	p.matrixTransform = function(m) {
		var objs = this.objects.data;
		for (var i = 0, l = objs.length; i < l; i++) objs[i].matrixTransform(m);
	}

	/**
	 * Mirror according to orientation.
	 * 
	 * @method mirror
	 * @param {String} orientation - 'horiz' - horizontal, 'vert' - vertical.
	 **/
	p.mirror = function(orientation) {
		Path.prototype.mirror.call(this, orientation);
	}

	/**
	 * Align in rectangle by base.
	 * 
	 * @method align
	 * @param {String} base - align base: 'left', 'right', 'center', 'top', 'bottom', 'vert'.
	 * @param {Rectangle} rect - align rectangle.
	 **/
	p.align = function(base, rect) {
		Path.prototype.align.call(this, base, rect);
	}

	/**
	 * Place into specified rectangle.
	 * 
	 * @method placeIntoRect
	 * @param {Rectangle} tR - the Rectangle.
	 **/
	p.placeIntoRect = function(tR) {
		Path.prototype.placeIntoRect.call(this, tR);
	}  

	/**
	 * Place around specified Point.
	 * 
	 * @method placeAroundPoint
	 * @param {Point} pt - center point.
	 * @param {Number} dist - distance from center to sides.
	 **/
	p.placeAroundPoint = function(pt, dist) {
		Path.prototype.placeAroundPoint.call(this, pt, dist);
	}

	/**
	 * Clone object group.
	 * 
	 * @method clone
	 * 
	 * @return {ObjGroup} a cloned group.
	 **/
	p.clone = function() {
		var objs = this.objects.data, tmpArr = [];
	    for (var i = 0, l = objs.length; i < l; i++) tmpArr.push(objs[i]);
	    return new ObjGroup(this.id, tmpArr);
	}

	/**
	 * Returns a string representation of this object.
	 * 
	 * @method toString
	 * 
	 * @return {String} a string representation of this object.
	 **/
	p.toString = function() {
	    return "[ObjGroup(id:" + this.id + ")]";
	}
	
	//set up for global use
	window.ObjGroup = ObjGroup;
}() );
