function HUD(player) {

	var hudElements = new jaws.SpriteList();

	hudElements.push(new FaceIndicator(player));
	hudElements.push(new FluidMeter(player, 'medicine'));
	hudElements.push(new FluidMeter(player, 'light'));
	hudElements.push(new ItemCounter(player));

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
	this.faceAnimation = new jaws.Animation({
		sprite_sheet : "./assets/art/status_faces.png",
		frame_size : [215, 215],
		loop : false
	});
	this.faceAnimationIndex = 0;
	// helps track which face is being displayed
	this.playerFace = new jaws.Sprite({
		x : FACE_HUD_X,
		y : FACE_HUD_Y,
		anchor : "center",
		scale : 0.55
	});
	this.playerFace.setImage(this.faceAnimation.next());

	/* This will animate the golden glow around the player picture.*/
	this.borderAnimation = new jaws.Animation({
		sprite_sheet : "./assets/art/border_anim.png",
		frame_size : [243, 243],
		loop : true
	});
	this.hudBorder = new jaws.Sprite({
		x : FACE_HUD_X,
		y : FACE_HUD_Y,
		anchor : "center",
		scale : 0.75
	});
	this.hudBorder.setImage(this.borderAnimation.frames[0]);

	this.update = function() {
		//check the player's life, and change the player's HUD face accordingly
		var old_anim_index = this.faceAnimationIndex;

		if (player.zombieLevel == 0) {
			if (this.faceAnimationIndex != 0) {
				this.playerFace.setImage(this.faceAnimation.frames[0]);
				this.faceAnimationIndex = 0;
			}
		} else if (player.zombieLevel == 2) {
			if (this.faceAnimationIndex != 2) {
				// 04-11-13: we skip from frames[0] to frames[2] because we now need 7 faces
				this.playerFace.setImage(this.faceAnimation.frames[2]);
				this.faceAnimationIndex = 2;

			}
		} else if (player.zombieLevel == 3) {
			if (this.faceAnimationIndex != 3) {
				this.playerFace.setImage(this.faceAnimation.frames[3]);
				this.faceAnimationIndex = 3;
			}
		} else if (player.zombieLevel == 4) {
			if (this.faceAnimationIndex != 4) {
				this.playerFace.setImage(this.faceAnimation.frames[4]);
				this.faceAnimationIndex = 4;
			}
		} else if (player.zombieLevel == 5) {
			if (this.faceAnimationIndex != 5) {
				this.playerFace.setImage(this.faceAnimation.frames[5]);
				this.faceAnimationIndex = 5;
			}
		} else if (player.zombieLevel == 6) {
			if (this.faceAnimationIndex != 6) {
				this.playerFace.setImage(this.faceAnimation.frames[6]);
				this.faceAnimationIndex = 6;
			}
		} else {
			if (this.faceAnimationIndex != 7) {
				this.playerFace.setImage(this.faceAnimation.frames[7]);
				this.faceAnimationIndex = 7;
			}
		}

		//if there is a face change, highlight the HUD box to make it
		//obvious to the player
		if (old_anim_index != this.faceAnimationIndex) {
			this.hudBorder.setImage(this.borderAnimation.frames[1]);
			var hudB = this.hudBorder;
			//keep references for anon. function
			var bAnim = this.borderAnimation;
			setTimeout(function() {
				hudB.setImage(bAnim.frames[0]);
			}, 500);
		}

	}

	this.draw = function() {
		this.playerFace.draw();
		this.hudBorder.draw();
	}
}

/**
 * The FluidMeter is the HUD Element which conveys information about fluid
 * player properties (e.g. health, light exposure).  Fluid properties
 * are lost over time and are gained by the corresponding game element.
 * @param {Object} player the player we're tracking
 */
function FluidMeter(player, type) {

	var METER_HUD_X = 675;
	var METER_HUD_Y;

	if (type == 'medicine') {
		METER_HUD_Y = 185;
	} else if (type == 'light') {
		METER_HUD_Y = 237;
	}

	var indicator_image_string = "./assets/art/CHANGEME_indicator.png".replace("CHANGEME", type);

	this.barSprite = new jaws.Sprite({
		image : "./assets/art/meter_bar.png",
		anchor : "center",
		x : METER_HUD_X,
		y : METER_HUD_Y,
		scale : 0.75
	});

	this.indicatorSprite = new jaws.Sprite({
		image : indicator_image_string,
		anchor : "center_left",
		x : 615.1,
		y : METER_HUD_Y,
		scale : 0.75
	});
	this.indicatorSprite.setWidth(0);

	this.update = function() {

		var new_indicator_sprite_width;

		if (type == 'medicine') {
			new_indicator_sprite_width = (player.medicineLife / 100.0) * 122;
		} else if (type == 'light') {
			new_indicator_sprite_width = (player.lightExposure / 100.0) * 122;
		}

		// Meter Sprite has an effective drawing width of 122 px (for 100% life),
		// we must scale it down 1.22 px for every unit change of fluid
		this.indicatorSprite.setWidth(new_indicator_sprite_width);
	}

	this.draw = function() {
		this.indicatorSprite.draw();
		this.barSprite.draw();

	}
}

function ItemCounter(player) {

	var ITEM_HUD_X = 530;
	var ITEM_HUD_Y = 90;
	var BOTTLECAP_COUNTER_INDEX = 0;
	var RATIONS_COUNTER_INDEX = 1;
	var WATERS_COUNTER_INDEX = 2;
	var counters = new Array();

	this.bottlecapAnimation = new jaws.Animation({
		sprite_sheet : "./assets/art/bottlecap_anim.png",
		frame_size : [104, 104],
		loop : true
	});
	counters[BOTTLECAP_COUNTER_INDEX] = 0;
	this.bottlecapSprite = new jaws.Sprite({
		anchor : "center",
		x : ITEM_HUD_X,
		y : ITEM_HUD_Y - 40,
		scale : 0.40
	});
	this.bottlecapSprite.setImage(this.bottlecapAnimation.next());

	this.rationsAnimation = new jaws.Animation({
		sprite_sheet : "./assets/art/rations_anim.png",
		frame_size : [104, 104],
		loop : true
	});
	counters[RATIONS_COUNTER_INDEX] = 0;
	this.rationsSprite = new jaws.Sprite({
		anchor : "center",
		x : ITEM_HUD_X,
		y : ITEM_HUD_Y,
		scale : 0.40
	});
	this.rationsSprite.setImage(this.rationsAnimation.next());

	this.watersAnimation = new jaws.Animation({
		sprite_sheet : "./assets/art/water_anim.png",
		frame_size : [104, 104],
		loop : true
	});
	counters[WATERS_COUNTER_INDEX] = 0;
	this.watersSprite = new jaws.Sprite({
		anchor : "center",
		x : ITEM_HUD_X,
		y : ITEM_HUD_Y + 40,
		scale : 0.40
	});
	this.watersSprite.setImage(this.watersAnimation.next());

	this.update = function() {

		if (player.numberOfBottlecapsCollected != counters[BOTTLECAP_COUNTER_INDEX]) {
			counters[BOTTLECAP_COUNTER_INDEX] = player.numberOfBottlecapsCollected;
			this.bottlecapSprite.setImage(this.bottlecapAnimation.next());

			var bcSprite = this.bottlecapSprite;
			//keep references for anon. function
			var bcAnim = this.bottlecapAnimation;
			setTimeout(function() {
				bcSprite.setImage(bcAnim.next());
			}, 500);
		}

		if (player.numberOfRationsCollected != counters[RATIONS_COUNTER_INDEX]) {
			counters[RATIONS_COUNTER_INDEX] = player.numberOfRationsCollected;
			this.rationsSprite.setImage(this.rationsAnimation.next());

			var rSprite = this.rationsSprite;
			//keep references for anon. function
			var rAnim = this.rationsAnimation;
			setTimeout(function() {
				rSprite.setImage(rAnim.next());
			}, 500);
		}

		if (player.numberOfWatersCollected != counters[WATERS_COUNTER_INDEX]) {
			counters[WATERS_COUNTER_INDEX] = player.numberOfWatersCollected;
			this.watersSprite.setImage(this.watersAnimation.next());

			var wSprite = this.watersSprite;
			//keep references for anon. function
			var wAnim = this.watersAnimation;
			setTimeout(function() {
				wSprite.setImage(wAnim.next());
			}, 500);
		}

	}

	this.draw = function() {
		this.bottlecapSprite.draw();
		this.rationsSprite.draw();
		this.watersSprite.draw();

		for (var counterIndex = 0; counterIndex < counters.length; counterIndex++) {

			jaws.context.font = "24pt Denk One";
			jaws.context.lineWidth = 20;
			jaws.context.fillStyle = "#1C1C1C";
			jaws.context.strokeStyle = "rgba(200,200,200,0.0)";
			jaws.context.fillText("x" + counters[counterIndex], ITEM_HUD_X + 30, ITEM_HUD_Y - 26 + (counterIndex * 40));
		}
	}
}

