
function Player(x,y) {
    
    var player_horiz_anim = new jaws.Animation({sprite_sheet: "./assets/art/player_spritesheet_leftright.png", frame_size:[128,128], loop:true});
    var player_vert_anim  = new jaws.Animation({sprite_sheet: "./assets/art/player_spritesheet_updown.png", frame_size:[128,128], loop:true});
    
    //Sprite and collision attributes
    this.sprite = new jaws.Sprite({x: x, y: y, anchor:"center", scale: 0.75});
    this.anim_walk_left  = player_horiz_anim.slice(0,8);
    this.anim_walk_right = player_horiz_anim.slice(8,16);
    this.anim_walk_down  = player_vert_anim.slice(0,8);
    this.anim_walk_up    = player_vert_anim.slice(8,16);
    this.sprite.setImage(this.anim_walk_right.next());
    this.radius = 16; //px - this radius is made available for circle-based collision
    this.facingHorizontally = true;
    this.x = this.sprite.x;
    this.y = this.sprite.y;
    
    //Game logic attributes
    this.life = 100;
    this.medicineLife   = 0.0;
    this.diseasePenalty = 0.1;
    this.numberOfWatersCollected     = 0;
    this.numberOfRationsCollected    = 0;
    this.numberOfBottlecapsCollected = 0;
    
    this.update = function() {
    	this.x = this.sprite.x; //refresh the info
    	this.y = this.sprite.y;
    }
    
    this.draw = function() {
        this.sprite.draw();
    }
    
    this.rect = function() {
        return this.sprite.rect().move(32,32).resizeTo(32,32);
    }
    
    this.applyDamage = function(inLantern) {
    	if(this.medicineLife > 75.0 && inLantern) {
    		this.life -= this.diseasePenalty;
    	}
    	
    	else if(this.medicineLife > 0.0) {
    		this.medicineLife -= this.diseasePenalty;
    	}
    	
    	else {
    		this.life -= this.diseasePenalty;
    	}
    	
    	bound_health_stats(this);
    }
    
      
    /**
     * Forces the 'player' to have reasonable life values.
     * @param {Object} player the player to bound the life of
     */
    function bound_health_stats(player) {
    	if(player.medicineLife > 100) {
    		player.medicineLife = 100;
  		}
  		
  		if(player.medicineLife < 0) {
  			player.medicineLife = 0;
    	}
    
    	if(player.life > 100) {
    		player.life = 100;
    	}
    }
    
}
