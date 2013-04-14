function init() {

	/* Importing Title assets */
	jaws.assets.add("./assets/art/title_animation.png");
	jaws.assets.add("./assets/art/gameover_animation.png");

	/* Importing Player assets */
	jaws.assets.add("./assets/art/player_LR_spritesheet_zombies.png");
	jaws.assets.add("./assets/art/player_spritesheet_leftright.png");
	jaws.assets.add("./assets/art/player_spritesheet_updown.png");
	jaws.assets.add("./assets/art/player_UD_spritesheet_zombies.png");
	jaws.assets.add("./assets/art/status_faces.png");
	jaws.assets.add("./assets/art/border_anim.png");
	jaws.assets.add("./assets/art/meter_bar.png")
	jaws.assets.add("./assets/art/light_indicator.png");
	jaws.assets.add("./assets/art/medicine_indicator.png");

	/* Importing Background assets */
	jaws.assets.add("./assets/art/gate.png");
	jaws.assets.add("./assets/art/grass.png");
	jaws.assets.add("./assets/art/grass_alt.png");
	jaws.assets.add("./assets/art/grass_square1.png");
	jaws.assets.add("./assets/art/grass_square2.png");
	jaws.assets.add("./assets/art/trees_topmiddle.png");
	jaws.assets.add("./assets/art/trees_middleleft.png");

	/* Importing House assets */
	jaws.assets.add("./assets/art/house1_topleft.png");
	jaws.assets.add("./assets/art/house2_topright.png");
	jaws.assets.add("./assets/art/house3_bottomleft.png");
	jaws.assets.add("./assets/art/house4_bottommiddle.png");
	jaws.assets.add("./assets/art/house5_bottomright.png");

	/* Importing Lantern assets */
	jaws.assets.add("./assets/art/lantern.png");
	jaws.assets.add("./assets/art/safety_ring.png");
	jaws.assets.add("./assets/art/lamppost_small.png");
	jaws.assets.add("./assets/art/light_small.png");
	jaws.assets.add("./assets/art/lamppost_large.png");
	jaws.assets.add("./assets/art/light_large.png");

	/* Importing Item assets */
	jaws.assets.add("./assets/art/medpac.png");
	jaws.assets.add("./assets/art/bottlecap.png");
	jaws.assets.add("./assets/art/rations.png");
	jaws.assets.add("./assets/art/water.png");
	jaws.assets.add("./assets/art/bottlecap_anim.png");
	jaws.assets.add("./assets/art/rations_anim.png");
	jaws.assets.add("./assets/art/water_anim.png");

	jaws.start(MenuState);

}
