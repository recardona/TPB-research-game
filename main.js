
function init() {

	/* Importing Player assets */
    jaws.assets.add("./assets/art/player_LR_spritesheet_zombies.png");
    jaws.assets.add("./assets/art/player_spritesheet_leftright.png");
    jaws.assets.add("./assets/art/player_spritesheet_updown.png");
    jaws.assets.add("./assets/art/player_UD_spritesheet_zombies.png");
    jaws.assets.add("./assets/art/status_faces.png");
    
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
    
    /* Importing Test assets */
    jaws.assets.add("./assets/art/parallax_1.png");
	
	jaws.start(MenuState);
	
}
