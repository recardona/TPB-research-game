/**
 * An Item represents a Sprite which can be picked up by the player. 
 * @param {Map} properties various properites that affect how the item is instantiated.
 * 	The Item expects the following properties:
 * 		properties.type -> a string of the filename (without the extension) that corresponds
 * 			to the desired item.  It should be one of four strings: bottlecap, medpac, rations, or
 * 			water
 * 				
 * 		properties.x -> the x coordinate, anchored by the center
 * 		properties.y -> the y coordinate, anchored by the center
 * 
 */
function Item(properties) {
	
	this.sprite = new jaws.Sprite({x:properties.x, y:properties.y, scale:0.40, anchor:"center", image:"./assets/art/"+
		"CHANGEME.png".replace("CHANGEME", properties.type)});
		
	this.draw = function() {
		this.sprite.draw();
	}
	
	this.rect = function() {
		return this.sprite.rect();
	}
	
	
}
