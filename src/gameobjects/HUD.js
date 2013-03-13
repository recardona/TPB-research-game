
function HUD(player) {
	
	var hudElements = new jaws.SpriteList();
	
	hudElements.push( new FaceIndicator(player) );
	hudElements.push( new MedicineMeter(player) );
	hudElements.push( new ItemCounter(player) );
	
	this.update = function() {
		hudElements.update();
	}
	
	this.draw = function() {
		hudElements.draw();
	}
	
}



/**
 * The FaceIndicator is the HUD Element which conveys Feedback
 * on the player's current health.  Instead of a direct meter,
 * Follow the Light! uses stages of player health, which slowly
 * depict the player becoming a zombie.
 * @param {Object} player the player we're tracking
 */
function FaceIndicator(player) {
	
	var FACE_HUD_X = 675;
	var FACE_HUD_Y = 90;
	
	/* This will animate the image of the player in the top-right corner of the HUD. */
	this.faceAnimation = new jaws.Animation({sprite_sheet: "./assets/art/status_faces.png", frame_size:[215,215], loop:false});
	this.faceAnimationIndex = 0; // helps track which face is being displayed
	this.playerFace = new jaws.Sprite({x: FACE_HUD_X, y:FACE_HUD_Y, anchor:"center", scale: 0.55});
	this.playerFace.setImage(this.faceAnimation.next());
	
	/* This will animate the golden glow around the player picture.*/
	this.borderAnimation = new jaws.Animation({sprite_sheet: "./assets/art/border_anim.png", frame_size:[243,243], loop:true});
	this.hudBorder = new jaws.Sprite({x:FACE_HUD_X, y:FACE_HUD_Y, anchor:"center", scale:0.75});
	this.hudBorder.setImage(this.borderAnimation.next());
	
	this.update = function() {
		//check the player's life, and change the player's HUD face accordingly
		var old_anim_index = this.faceAnimationIndex;
		
	    if(player.life > 87.5) {
	    	if(this.faceAnimationIndex != 0) {
	    		this.playerFace.setImage(this.faceAnimation.frames[0]);
	    		this.faceAnimationIndex = 0;
	        }
	    }
	    
	    else if(player.life > 75) {
	    	if(this.faceAnimationIndex != 1) {
	   	        this.playerFace.setImage(this.faceAnimation.frames[1]);
		        this.faceAnimationIndex = 1;
	    	}
	    }
	    
	    else if(player.life > 62.5) {
	    	if(this.faceAnimationIndex != 2) {
	    		this.playerFace.setImage(this.faceAnimation.frames[2]);
	    	    this.faceAnimationIndex = 2;
	    	    
	    	}
	    }
	    
	    else if(player.life > 50) {
	    	if(this.faceAnimationIndex != 3) {
		        this.playerFace.setImage(this.faceAnimation.frames[3]);
	    	    this.faceAnimationIndex = 3;
	    	}
	    }
	    
	    else if(player.life > 37.5) {
	    	if(this.faceAnimationIndex != 4) {
	        	this.playerFace.setImage(this.faceAnimation.frames[4]);
	        	this.faceAnimationIndex = 4;
	    	}
	    }
	    
	    else if(player.life > 25) {
	    	if(this.faceAnimationIndex != 5) {
	        	this.playerFace.setImage(this.faceAnimation.frames[5]);
	        	this.faceAnimationIndex = 5;
	    	}
	    }
	    
	    else if(player.life > 12.5) {
	    	if(this.faceAnimationIndex != 6) {
	        	this.playerFace.setImage(this.faceAnimation.frames[6]);
	        	this.faceAnimationIndex = 6;
	    	}
	    }
	    
	    else {
	    	if(this.faceAnimationIndex != 7) {
	    		this.playerFace.setImage(this.faceAnimation.frames[7]);
	    		this.faceAnimationIndex = 7;
	    	}
	    }
	    
	    //if there is a face change, highlight the HUD box to make it
	    //obvious to the player
	    if(old_anim_index != this.faceAnimationIndex) {
			this.hudBorder.setImage(this.borderAnimation.next());
			
			var hudB  = this.hudBorder; //keep references for anon. function
			var bAnim = this.borderAnimation; 
			setTimeout(function(){hudB.setImage(bAnim.next());},750);
	    }
	    		
	}
	
	this.draw = function() {
		this.playerFace.draw();
		this.hudBorder.draw();
	}
	
	
}


/**
 * The MedicineMeter is the HUD Element which conveys information about
 * the player's amount of medicine.  Medicine is lost over time and is
 * gained by picking up medpacs.  
 * @param {Object} player the player we're tracking
 */
function MedicineMeter(player) {
	
	var MEDICINE_HUD_X = 675;
	var MEDICINE_HUD_Y = 185;
	
	this.barSprite       = new jaws.Sprite({image:"./assets/art/medicine_bar.png", anchor:"center", x:MEDICINE_HUD_X, y:MEDICINE_HUD_Y, scale:0.75});
	this.indicatorSprite = new jaws.Sprite({image:"./assets/art/medicine_indicator.png", anchor: "center_left", x:615.1, y:185, scale:0.75});
	this.indicatorSprite.setWidth(0);
	
	this.update = function() {
		// Meter Sprite has an effective drawing width of 122 px (for 100% life),
		// we must scale it down 1.22 px for every unit change of medicine
		var new_indicator_sprite_width = (player.medicineLife/100.0)*122; //px
		this.indicatorSprite.setWidth(new_indicator_sprite_width);						
	}
	
	this.draw = function() {
		this.indicatorSprite.draw();
		this.barSprite.draw();
		
	}
	
}

function ItemCounter(player) {
    
    var ITEM_HUD_X = 540;
    var ITEM_HUD_Y = 90;
    
    this.bottleCapSprite   = new jaws.Sprite({image:"./assets/art/bottlecap.png", anchor:"center", x:ITEM_HUD_X, y:ITEM_HUD_Y-40, scale:0.40});
    this.foodRationsSprite = new jaws.Sprite({image:"./assets/art/rations.png", anchor:"center", x:ITEM_HUD_X, y:ITEM_HUD_Y, scale:0.40});
    this.waterBottleSprite = new jaws.Sprite({image:"./assets/art/water.png", anchor:"center", x:ITEM_HUD_X, y:ITEM_HUD_Y+40, scale:0.40});
    
    this.update = function() {
        //do nothing
    }
    
    this.draw = function() {
        
        this.bottleCapSprite.draw();
        this.foodRationsSprite.draw();
        this.waterBottleSprite.draw();
        
        // jaws.context.clearRect(0,0,jaws.width,jaws.height);
        // title_img.draw();
        // for(var i=0; items[i]; i++) {
            // jaws.context.font = "36pt Denk One";
            // jaws.context.lineWidth = 20;
            // jaws.context.fillStyle =  (i == index) ? "#E5F361" : "#62625F";
            // jaws.context.strokeStyle =  "rgba(200,200,200,0.0)";
            // jaws.context.fillText(items[i], jaws.width*3/4, jaws.height*7/8 + i * (50));
        // } 
    }
    
}


