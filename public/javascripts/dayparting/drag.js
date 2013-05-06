function Drag(ele, option) {
	this.ele = ele;
	this.start = new Point(0, 0);
	this.stop = new Point(0, 0);
	this.opt = option;

	this.down = function(e) {
		
		$.isFunction(this.opt.onBeforeDrag) && this.opt.onBeforeDrag();

		this.start.set(e.pageX, e.pageY);
		this.stop.set(e.pageX, e.pageY);

		this.ele.mousemove(this.move);
		this.ele.mouseup(this.up);
		e.preventDefault();
	}.bind(this);

	this.move = function(e) {
		this.stop.set(
			e.pageX,
			e.pageY
		);
		$.isFunction(this.opt.onDragging) && this.opt.onDragging(this.start, this.stop);
		e.preventDefault();
	}.bind(this);

	this.up = function(e) {
		$.isFunction(this.opt.onComplete) && this.opt.onComplete(this.start,this.stop);
		this.ele.unbind('mousemove',this.move);
		this.ele.unbind('mouseup',this.up);
		e.preventDefault();
	}.bind(this);

	this.ele.mousedown(this.down);
}

