/**
 * @file Path implementation in 2D coordinate system.
 * @author Olegos <olegos83@yandex.ru>
 */

/**
 * Path can describe line, polyline and polygon and can have linear, quadratic curve and bezier segments.
 * 
 * Any of path points can be extended with dynamic properties. For example: prev and next describe
 * control points for curved segments and mv, if true, then point only is for moveTo without drawing.
 * 
 * @class Path
 * @memberof WebbyJs
 */
WebbyJs.createClass({
	/**
	 * Class name.
	 */
	name: 'Path',
	
	/**
	 * @constructor
	 * 
	 * @param {Array} points - points array. Default is empty array.
	 * @param {Boolean} closed - closed flag. Default is false.
	 */
	construct: function Path(points, closed) {
		/**
		 * Data array for points.
		 * 
		 * @memberof Path
		 * @type {Array}
		 */
		this.dp_storage = points || [];
		
	    /**
	     * Closed flag.
	     * 
	     * @memberof Path
	     * @type {Boolean}
	     */
	    this.closed = closed || false;
	},
	
	/**
	 * Prototype.
	 */
	proto: {
		/**
		 * Move Path points by x/y deltas.
		 * 
		 * @method move
		 * @memberof Path.prototype
		 * 
		 * @param {Number} dx - X delta.
		 * @param {Number} dy - Y delta.
		 * 
		 * @returns {Path} current instance for chaining.
		 */
		move: function(dx, dy) {
		    var pt = this.points.data, l = pt.length, p = null;
		    
		    for (var i = 0; i < l; i++) {
		    	p = pt[i];
		    	move(dx, dy);
		    	
		    	if (prev) prev.move(dx, dy);
		    	if (next) next.move(dx, dy);
		    }
		    
		    return this;
		},
		
		/**
		 * Move Path points by distance in specified direction.
		 * 
		 * @method moveDir
		 * @memberof Path.prototype
		 * 
		 * @param {Number} dist - distance to move.
		 * @param {Number} angle - direction (in radians).
		 * 
		 * @returns {Path} current instance for chaining.
		 */
		moveDir: function(dist, angle) {
		    var pt = this.points.data, l = pt.length, p = null;
		    
		    for (var i = 0; i < l; i++) {
		    	p = pt[i];
		    	moveDir(dist, angle);
		    	
				if (prev) prev.moveDir(dist, angle);
				if (next) next.moveDir(dist, angle);
		    }
		    
		    return this;
		},
		
		/**
		 * Rotate Path points around pivot by specified angle.
		 * 
		 * @method rotate
		 * @memberof Path.prototype
		 * 
		 * @param {Number} angle - rotation angle (in radians).
		 * @param {Point} pivot - pivot to rotate around.
		 * 
		 * @returns {Path} current instance for chaining.
		 */
		rotate: function(angle, pivot) {
		    var pt = this.points.data, l = pt.length, p = null;
		    
		    for (var i = 0; i < l; i++) {
		    	p = pt[i];
		    	rotate(angle, pivot);
		    	
		    	if (prev) prev.rotate(angle, pivot);
		    	if (next) next.rotate(angle, pivot);
		    }
		    
		    return this;
		},
		
		/**
		 * Scale Path points from pivot by specified scX/scY koefs.
		 * 
		 * @method scale
		 * @memberof Path.prototype
		 * 
		 * @param {Number} scX - x scale koef.
		 * @param {Number} scY - y scale koef.
		 * @param {Point} pivot - pivot to scale from.
		 * 
		 * @returns {Path} current instance for chaining.
		 */
		scale: function(scX, scY, pivot) {
		    var pt = this.points.data, l = pt.length, p = null;
		    
		    for (var i = 0; i < l; i++) {
		    	p = pt[i];
		    	scale(scX, scY, pivot);
		    	
		   		if (prev) prev.scale(scX, scY, pivot);
		   		if (next) next.scale(scX, scY, pivot);
		    }
		    
		    return this;
		},
		
		/**
		 * Apply matrix transformation to Path points.
		 * 
		 * @method matrixTransform
		 * @memberof Path.prototype
		 * 
		 * @param {Matrix} m - a transformation matrix.
		 * 
		 * @returns {Path} current instance for chaining.
		 */
		matrixTransform: function(m) {
		    var pt = this.points.data, l = pt.length, p = null;
		    
		    for (var i = 0; i < l; i++) {
		    	p = pt[i];
		    	matrixTransform(m);
		    	
		   		if (prev) prev.matrixTransform(m);
		   		if (next) next.matrixTransform(m);
		    }
		    
		    return this;
		},
		
		/**
		 * Returns a bounding rectangle of this Path.
		 * 
		 * @method getBoundRect
		 * @memberof Path.prototype
		 * 
		 * @returns {Rectangle} a bounding rectangle.
		 */
		getBoundRect: function() {
		    //init vars
		    var pt = this.points.data, l = pt.length;
		    if (l == 0) return null;
		    
		    //set min and max to first point
		    var p = pt[0], x = x, y = y, minX = x, minY = y, maxX = x, maxY = y;
		    
		    //find min and max points
		    for (var i = 0; i < l; i++) {
		    	//check min/max in main points
		    	p = pt[i]; x = x; y = y;
		    	
		        if (x < minX) minX = x; if (y < minY) minY = y;
		        if (x > maxX) maxX = x; if (y > maxY) maxY = y;
		        
		        //check control points
		        var endi = i + 1; if (endi >= l) endi = 0;
		        var cp1 = next, cp2 = pt[endi].prev;
		        
		        if (cp1 || cp2) {
		        	//init temporary points
		        	var xx = [], yy = [], ep = pt[endi];
		        	
		        	//check curve type
		        	if (cp1 && cp2) {
		        		//bezier curve rect correction
		        		var cpx1 = cp1.x, cpy1 = cp1.y,
		        			cpx2 = cp2.x, cpy2 = cp2.y;
		        		
		        		var mx1 = (x + cpx1) / 2, my1 = (y + cpy1) / 2,
		        			mx3 = (cpx1 + cpx2) / 2, my3 = (cpy1 + cpy2) / 2,
		        			mx2 = (mx1 + mx3) / 2, my2 = (my1 + my3) / 2,
		        			mx5 = (cpx2 + ex) / 2, my5 = (cpy2 + ey) / 2,
		        			mx4 = (mx3 + mx5) / 2, my4 = (my3 + my5) / 2;
		        		
		        		xx.push(mx1, mx2, mx4, mx5);
		        		yy.push(my1, my2, my4, my5);
		        	} else {
		        		//quadratic curve rect correction
		        		var cp = cp1 || cp2, cpx = cx, cpy = cy;
		        		
		        		xx.push((x + cpx) / 2, (cpx + ex) / 2);
		        		yy.push((y + cpy) / 2, (cpy + ey) / 2);
		        	}
		        	
		        	//check min/max in temporary points
		        	for (var j = 0, ll = xx.length; j < ll; j++) {
		        		x = xx[j]; y = yy[j];
		                if (x < minX) minX = x; if (y < minY) minY = y;
		                if (x > maxX) maxX = x; if (y > maxY) maxY = y;
		        	}
		        }
		    }
		    
		    //return rectangle
		    return new Rectangle(new Point(minX, minY), new Point(maxX, maxY));
		},
		
		/**
		 * Clone this Path.
		 * 
		 * @method clone
		 * @memberof Path.prototype
		 * 
		 * @returns {Path} a cloned Path.
		 */
		clone: function() {
			//init vars
		    var pt = this.points.data, l = pt.length, tmpArr = [], p = null, p2 = null;;
			
		    //clone points
		    for (var i = 0; i < l; i++) {
		    	p = pt[i]; p2 = clone();
		    	
		    	if (mv) p2.mv = mv;
		    	if (prev) p2.prev = prev.clone();
		    	if (next) p2.next = next.clone();
		    	
		    	tmpArr.push(p2);
		    }
		    
		    //return cloned path
		    return new Path(tmpArr, this.closed);
		},
		
		/**
		 * Create ellipse and return it as Path.
		 * 
		 * @method ellipse
		 * @memberof Geom
		 * 
		 * @param {Point} c - center.
		 * @param {Number} r1 - radius 1.
		 * @param {Number} r2 - radius 2.
		 * 
		 * @returns {Path} ellipse path.
		 */
		ellipse: function(c, r1, r2) {
			this.points.clear(); this.closed = true;
			
			//init vars
			var pt = this.points.data, x = c.x, y = c.y, qr1 = r1 / 2, qr2 = r2 / 2;
			pt.push(new Point(x, y - r1), new Point(x + r2, y), new Point(x, y + r1), new Point(x - r2, y));
			
			//setup curve
			pt[0].prev = new Point(x - qr2, y - r1); pt[0].next = new Point(x + qr2, y - r1);
			pt[1].prev = new Point(x + r2, y - qr1); pt[1].next = new Point(x + r2, y + qr1);
			pt[2].prev = new Point(x + qr2, y + r1); pt[2].next = new Point(x - qr2, y + r1);
			pt[3].prev = new Point(x - r2, y + qr1); pt[3].next = new Point(x - r2, y - qr1);
		},
		
		/**
		 * Create star and return it as Path.
		 * 
		 * @method star
		 * @memberof Geom
		 * 
		 * @param {Point} c - center.
		 * @param {Number} r1 - radius 1.
		 * @param {Number} r2 - radius 2.
		 * @param {Number} num_v - number of vertices.
		 * @param {Number} ofs - angle offset.
		 * 
		 * @returns {Path} star path.
		 */
		star: function(c, r1, r2, num_v, ofs) {
			this.points.clear(); this.closed = true;
			
			//init vars
			num_v *= 2;
			var alfa = 0, step = 2 * Math.PI / num_v, r = 0, ang = 0;
			
			//setup path
			for (var i = 0; i < num_v; i++) {
				if (r == r1) { r = r2; ang = alfa + ofs; } else { r = r1; ang = alfa; }
				this.points.add(new Point(c.x + r * Math.sin(ang), c.y + r * Math.cos(ang)));
				alfa += step;
			}
		},
		
		/**
		 * Get/Set Path svg value.
		 * 
		 * @method svg
		 * @memberof Path.prototype
		 * 
		 * @param {String} d - svg path notation from 'd' attribute.
		 * 
		 * @returns {String|Path} path as svg 'd' string or current instance for chaining.
		 */
		svg: function(d) {
			//init vars
			var points = this.points.data, i = 0, pt;
			
			//return path as svg 'd' string
			if (!d) {
				var l = points.length, str = '', cp;
				if (l == 0) return str;
				
				pt = points[0];
				str = 'M' + pt.x.toFixed(3) + ',' + pt.y.toFixed(3);
				
				for (i = 1; i < l; i++) {
					pt = points[i];
					
					//move point
					if (pt.mv) {
						str += ' M' + pt.x.toFixed(3) + ',' + pt.y.toFixed(3);
						
					//drawing point
					} else {
						cp = points[i - 1].next || pt.prev;
						
						//curve
						if (cp) {
							//quadratic
							if (cp == pt.prev) {
								str += ' Q' + cx.toFixed(3) + ',' + cy.toFixed(3) +
										' ' + pt.x.toFixed(3) + ',' + pt.y.toFixed(3);
								
							//cubic bezier
							} else {
								str += ' C' + cx.toFixed(3) + ',' + cy.toFixed(3) +
										' ' + pt.prev.x.toFixed(3) + ',' + pt.prev.y.toFixed(3) +
										' ' + pt.x.toFixed(3) + ',' + pt.y.toFixed(3);
							}
							
						//line
						} else str += ' L' + pt.x.toFixed(3) + ',' + pt.y.toFixed(3);
					}
				}
				
				//close and return
				if (this.closed) str += 'Z';
				return str;
			}
			
			//prepare 'd' string for parsing
			d = d.replace(/,/gm, ' '). //get rid of all commas
				  replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm, '$1 $2'). //separate commands from commands
				  replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm, '$1 $2').
				  replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm, '$1 $2'). //separate commands from points
				  replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm, '$1 $2').
				  replace(/([0-9])([+\-])/gm, '$1 $2').replace(/(\.[0-9]*)(\.)/gm, '$1 $2'). //separate digits when no comma
				  replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm, '$1 $3 $4 '). //shorthand elliptical arc path syntax
				  replace(/[\s\r\t\n]+/gm, ' ').replace(/^\s+|\s+$/g, '').split(' '); //compress multiple spaces, trim and split
			
			//parse svg path 'd' string
			var cmd, prevCmd, last = d.length - 1, startX = 0, startY = 0, curX = 0, curY = 0, cpX = 0, cpY = 0;
			points.length = 0; this.closed = false;
			
			//process path commands
			while (i <= last) {
				//check command
				cmd = d[i++];
				
				//'m' and 'M'
				if (cmd == 'M') {
					curX = parseFloat(d[i++]); curY = parseFloat(d[i++]);
					if (!prevCmd) { startX = curX; startY = curY; }
					
					pt = new Point(curX, curY); pt.mv = true;
					points.push(pt);
					
					while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
						curX = parseFloat(d[i++]); curY = parseFloat(d[i++]);
						pt = new Point(curX, curY); points.push(pt);
					}
				} else if (cmd == 'm') {
					curX += parseFloat(d[i++]); curY += parseFloat(d[i++]);
					if (!prevCmd) { startX = curX; startY = curY; }
					
					pt = new Point(curX, curY); pt.mv = true;
					points.push(pt);
					
					while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
						curX += parseFloat(d[i++]); curY += parseFloat(d[i++]);
						pt = new Point(curX, curY); points.push(pt);
					}
					
				//'l' and 'L'
				} else if (cmd == 'L') {
					while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
						curX = parseFloat(d[i++]); curY = parseFloat(d[i++]);
						pt = new Point(curX, curY); points.push(pt);
					}
				} else if (cmd == 'l') {
					while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
						curX += parseFloat(d[i++]); curY += parseFloat(d[i++]);
						pt = new Point(curX, curY); points.push(pt);
					}
					
				//'h' and 'H'
				} else if (cmd == 'H') {
					while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
						curX = parseFloat(d[i++]);
						pt = new Point(curX, curY); points.push(pt);
					}
				} else if (cmd == 'h') {
					while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
						curX += parseFloat(d[i++]);
						pt = new Point(curX, curY); points.push(pt);
					}
					
				//'v' and 'V'
				} else if (cmd == 'V') {
					while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
						curY = parseFloat(d[i++]);
						pt = new Point(curX, curY); points.push(pt);
					}
				} else if (cmd == 'v') {
					while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
						curY += parseFloat(d[i++]);
						pt = new Point(curX, curY); points.push(pt);
					}
					
				//'c' and 'C'
				} else if (cmd == 'C') {
					while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
						pt.next = new Point(parseFloat(d[i++]), parseFloat(d[i++]));
						
						cpX = parseFloat(d[i++]); cpY = parseFloat(d[i++]);
						curX = parseFloat(d[i++]); curY = parseFloat(d[i++]);
						
						pt = new Point(curX, curY); pt.prev = new Point(cpX, cpY);
						points.push(pt);
					}
				} else if (cmd == 'c') {
					while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
						pt.next = new Point(curX + parseFloat(d[i++]), curY + parseFloat(d[i++]));
						
						cpX = curX + parseFloat(d[i++]); cpY = curY + parseFloat(d[i++]);
						curX += parseFloat(d[i++]); curY += parseFloat(d[i++]);
						
						pt = new Point(curX, curY); pt.prev = new Point(cpX, cpY);
						points.push(pt);
					}
					
				//'s' and 'S'
				} else if (cmd == 'S') {
					while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
						if (prevCmd == 'C' || prevCmd == 'c' || prevCmd == 'S' || prevCmd == 's') {
							pt.next = new Point(2 * curX - cpX, 2 * curY - cpY);
						} else {
							pt.next = new Point(curX, curY);
						}
						
						cpX = parseFloat(d[i++]); cpY = parseFloat(d[i++]);
						curX = parseFloat(d[i++]); curY = parseFloat(d[i++]);
						
						pt = new Point(curX, curY); pt.prev = new Point(cpX, cpY);
						points.push(pt);
					}
				} else if (cmd == 's') {
					while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
						if (prevCmd == 'C' || prevCmd == 'c' || prevCmd == 'S' || prevCmd == 's') {
							pt.next = new Point(2 * curX - cpX, 2 * curY - cpY);
						} else {
							pt.next = new Point(curX, curY);
						}
						
						cpX = curX + parseFloat(d[i++]); cpY = curY + parseFloat(d[i++]);
						curX += parseFloat(d[i++]); curY += parseFloat(d[i++]);
						
						pt = new Point(curX, curY); pt.prev = new Point(cpX, cpY);
						points.push(pt);
					}
					
				//'q' and 'Q'
				} else if (cmd == 'Q') {
					while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
						cpX = parseFloat(d[i++]); cpY = parseFloat(d[i++]);
						curX = parseFloat(d[i++]); curY = parseFloat(d[i++]);
						
						pt = new Point(curX, curY); pt.prev = new Point(cpX, cpY);
						points.push(pt);
					}
				} else if (cmd == 'q') {
					while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
						cpX = curX + parseFloat(d[i++]); cpY = curY + parseFloat(d[i++]);
						curX += parseFloat(d[i++]); curY += parseFloat(d[i++]);
						
						pt = new Point(curX, curY); pt.prev = new Point(cpX, cpY);
						points.push(pt);
					}
					
				//'t' and 'T'
				} else if (cmd == 'T') {
					while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
						if (prevCmd == 'Q' || prevCmd == 'q' || prevCmd == 'T' || prevCmd == 't') {
							cpX = 2 * curX - cpX; cpY = 2 * curY - cpY;
						} else {
							cpX = curX; cpY = curY;
						}
						
						curX = parseFloat(d[i++]); curY = parseFloat(d[i++]);
						pt = new Point(curX, curY); pt.prev = new Point(cpX, cpY);
						points.push(pt);
					}
				} else if (cmd == 't') {
					while (i <= last && d[i].match(/^[A-Za-z]$/) == null) {
						if (prevCmd == 'Q' || prevCmd == 'q' || prevCmd == 'T' || prevCmd == 't') {
							cpX = 2 * curX - cpX; cpY = 2 * curY - cpY;
						} else {
							cpX = curX; cpY = curY;
						}
						
						curX += parseFloat(d[i++]); curY += parseFloat(d[i++]);
						pt = new Point(curX, curY); pt.prev = new Point(cpX, cpY);
						points.push(pt);
					}
					
				//'a' and 'A'
				} else if (cmd == 'A') {
					//need to implement
					while (i <= last && d[i].match(/^[A-Za-z]$/) == null) i += 7;
				} else if (cmd == 'a') {
					while (i <= last && d[i].match(/^[A-Za-z]$/) == null) i += 7;
					
				//'z' and 'Z'
				} else if (cmd == 'Z' || cmd == 'z') {
					curX = startX; curY = startY;
				}
				
				//set previous cmd
				prevCmd = cmd;
			}
			
			//return current instance
			return this;
		},
		
		/**
		 * Add this object to graphics context, where it may be rendered or used anyway else.
		 * 
		 * @method toContext
		 * @memberof Path.prototype
		 * 
		 * @param {CanvasRenderingContext2D} ctx - context.
		 * 
		 * @returns {Path} current instance for chaining.
		 */
		toContext: function(ctx) {
			return this;
		}
	},
	
	/**
	 * Interfaces.
	 */
	interfaces: WebbyJs.Geom
});
