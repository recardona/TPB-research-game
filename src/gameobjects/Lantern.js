/*
 * Lantern is an object which acts as a sort of safety zone.  A lantern's zone
 * (denoted by the rotating circle) slows down the progress of the disease.
 * 
 * However, in the presence of too much medicine, a lantern's safety zone actually
 * increases the rate at which the disease takes over. 
 */
function Lantern(x,y,isSmall) {
  	
  	this.x = x;
  	this.y = y;
  	this.radius  = 128; //radius field for collision
  	
  	if(isSmall == true) {
  		this.light        = new jaws.Sprite({image: "./assets/art/light_small.png", anchor:"center", x:x, y:y});
  		this.lanternPost  = new jaws.Sprite({image: "./assets/art/lamppost_small.png", anchor:"center", x:x, y:y});
  	}
  	
  	else {
  		this.light        = new jaws.Sprite({image: "./assets/art/light_large.png", anchor:"center", x:x, y:y});
  		this.lanternPost  = new jaws.Sprite({image: "./assets/art/lamppost_large.png", anchor:"center", x:x, y:y});  		
  	}
  	
  	
  	this.update = function() {
  		this.light.rotate(1); //degrees
  	}
  	
  	this.draw = function() {
  		this.lanternPost.draw();
  		this.light.draw();
  	}
  	
  	this.rect = function() {
  		return this.lanternPost.rect();
  	}
  }