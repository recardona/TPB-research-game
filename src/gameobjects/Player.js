function Player(x, y) {

	var player_horiz_anim = new jaws.Animation({
		sprite_sheet : "./assets/art/player_spritesheet_leftright.png",
		frame_size : [128, 128],
		loop : true
	});
	var player_vert_anim = new jaws.Animation({
		sprite_sheet : "./assets/art/player_spritesheet_updown.png",
		frame_size : [128, 128],
		loop : true
	});

	//Sprite and collision attributes
	this.sprite = new jaws.Sprite({
		x : x,
		y : y,
		anchor : "center",
		scale : 0.75
	});
	this.anim_walk_left = player_horiz_anim.slice(0, 8);
	this.anim_walk_right = player_horiz_anim.slice(8, 16);
	this.anim_walk_down = player_vert_anim.slice(0, 8);
	this.anim_walk_up = player_vert_anim.slice(8, 16);
	this.sprite.setImage(this.anim_walk_right.next());
	this.radius = 16; //px - this radius is made available for circle-based collision
	this.facingHorizontally = true;
	this.x = this.sprite.x;
	this.y = this.sprite.y;

	//Game logic attributes
	this.zombieLevel = 4;
	this.lightExposure = 50.0;
	this.timeSpentInLight = 0.0;
	this.medicineLife = 50.0;
	this.diseasePenalty = 0.05;
	this.numberOfWatersCollected = 0;
	this.numberOfRationsCollected = 0;
	this.numberOfBottlecapsCollected = 0;

	this.update = function() {
		//refresh the info
		this.x = this.sprite.x;
		this.y = this.sprite.y;
		
		var discrete_medicine_level = convert_to_discrete_level(this.medicineLife);
		var discrete_exposure_level = convert_to_discrete_level(this.lightExposure);
		this.zombieLevel = (discrete_medicine_level - 2) * (discrete_exposure_level - 2) + 4;				
	}

	this.draw = function() {
		this.sprite.draw();
	}

	this.rect = function() {
		return this.sprite.rect().move(32, 32).resizeTo(32, 32);
	}

	this.applyDamage = function() {

		if (this.lightExposure > 0.0) {
			this.lightExposure -= this.diseasePenalty;
		}
		
		else if (this.medicineLife > 0.0) {
			this.medicineLife -= this.diseasePenalty;
		}

		bound_player_stats(this);
	}
	
	/**
	 * Forces the 'player' to have reasonable life values.
	 * @param {Object} player the player to bound the life of
	 */
	function bound_player_stats(player) {
		if (player.medicineLife > 100) {
			player.medicineLife = 100;
		}

		if (player.medicineLife < 0) {
			player.medicineLife = 0;
		}
		
		if (player.lightExposure > 100) {
			player.lightExposure = 100.0;
		}

		if (player.lightExposure < 0) {
			player.lightExposure = 0;
		}
	}
	
	/**
	 * Auxiliary function to convert a continuous player attribute level
	 * to its corresponding discrete level.  This function is designed
	 * around the player's medicineLife and lightExposure attributes.
	 * 
	 * Both attributes are bounded between 0.0 and 100.0, and their
	 * discrete mappings are bounded between 0 and 4.
	 * @param {Object} continuousLevel the continuous value of the player attribute
	 * @return the discrete value that maps to the player's continuous-valued attribute
	 */
	function convert_to_discrete_level(continuousLevel) {
		// Example:
		//  79.0, which is between 75.0 and 100.0, belongs at the discrete
		//  value interval of 4.
		//  ceil( ( (79/100)*4 ) ) :)
		
		var transformedContinuousLevel = ((continuousLevel/100)*4);
		var discreteLevel = Math.ceil(transformedContinuousLevel);
		return discreteLevel;
	}

}
