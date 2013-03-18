/*
 * Lantern is an object which acts as a sort of safety zone.  A lantern's zone
 * (denoted by the rotating circle) slows down the progress of the disease.
 * 
 * However, in the presence of too much medicine, a lantern's safety zone actually
 * increases the rate at which the disease takes over. 
 */
function Lantern(x,y,isSmall) {
  	
  	if(isSmall == true) {
  		this.light = new jaws.Sprite({image: "./assets/art/light_small.png", anchor:"center", x:x, y:y});
  		this.post  = new jaws.Sprite({image: "./assets/art/lamppost_small.png", anchor:"center", x:x, y:y});
  	}
  	
  	else {
  		this.light = new jaws.Sprite({image: "./assets/art/light_large.png", anchor:"center", x:x, y:y});
  		this.post  = new jaws.Sprite({image: "./assets/art/lamppost_large.png", anchor:"center", x:x, y:y});  		
  	}
  	
  	this.radius = this.light.rect().width/2;
  	this.x = this.post.x;
  	this.y = this.post.y;
  	
  	
  	this.update = function() {
  		this.light.rotate(1); //degrees
  	}
  	
  	this.draw = function() {
  		this.post.draw();
  		this.light.draw();
  	}
  	
  }