
/**
 * A wrapper to a Rect object, for use in collision detection.
 * @param {Object} x the x coordinate of this collider
 * @param {Object} y the y coordinate of this collider
 * @param {Object} width the width of this collider
 * @param {Object} height the height of this collider
 */
function RectangularCollider(x, y, width, height) {
	
	this.rectCollider = new jaws.Rect(x, y, width, height);
	
	this.draw = function() {
		this.rectCollider.draw();
	}
	
	this.rect = function() {
		return this.rectCollider;
	}	
	
}
