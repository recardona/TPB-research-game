/*
 * Lantern is an object which acts as a sort of safety zone.  A lantern's zone
 * (denoted by the rotating circle) slows down the progress of the disease.
 * 
 * However, in the presence of too much medicine, a lantern's safety zone actually
 * increases the rate at which the disease takes over. 
 */
function Lantern(x,y) {
  	
  	this.x = x;
  	this.y = y;
  	this.radius = 128; //radius field for collision
  	
  	this.ring    = new jaws.Sprite({image: "./assets/art/safety_ring.png", anchor:"center", x:x, y:y});
  	this.lantern = new jaws.Sprite({image: "./assets/art/lantern.png", anchor:"center", x:x, y:y});
  	
  	this.update = function() {
  		this.ring.rotate(1); //degrees
  	}
  	
  	this.draw = function() {
  		this.lantern.draw();
  		this.ring.draw();
  	}
  }