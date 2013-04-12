/**
 *
 * PlayState is the actual game play. 
 * We switch to it once user choses "Start game"
 *
 */
function PlayState() {
  var player;
  var player_hud;
  var grass_blocks;
  var roads       = new jaws.SpriteList();
  var trees		  = new jaws.SpriteList();
  var lanterns    = new jaws.SpriteList();
  var buildings   = new jaws.SpriteList();
  var boundaries  = new jaws.SpriteList();
  var shrubberies = new jaws.SpriteList();
  
  var medpacs     = new jaws.SpriteList();
  var bottlecaps  = new jaws.SpriteList();
  var rations     = new jaws.SpriteList();
  var waters      = new jaws.SpriteList();
  
 
  var MAX_NUMBER_OF_ITEMS = 16;
  var acceptable_item_positions = setup_acceptable_item_positions();
  

  
  var sqrt_sixteen_halves = 4*Math.SQRT1_2;
  
  var width  = 72;
  var height = 54;
  var game_width_pixels  = width*32;
  var game_height_pixels = height*32;
  var viewport;
  var tile_map;
  
  /* Game event flags */
  var playerDidCollide = false;
  var playerCollidedWithMedpac    = false;
  var playerCollidedWithBottlecap = false;
  var playerCollidedWithRations   = false;
  var playerCollidedWithWaters    = false;
  var playerCollidedWithBoundary  = false;
  var playerCollidedWithBuilding  = false;
  var playerCollidedWithShrubbery = false;
  var playerCollidedWithLantern   = false;
  var playerInLanternLight = false;
  var playerLost  = false;
 
  
  this.setup = function() {
  	
  	/* Map setup. */
  	grass_blocks = setup_background_tiles();
	roads      = setup_road_tiles();
	buildings  = setup_buildings();
	boundaries = setup_boundaries();
	lanterns   = setup_lanterns();
  	
  	//the viewport is all the viewable area of a larger tilemap.  It allows scrolling.
  	viewport  = new jaws.Viewport({max_x:width*32, max_y:height*32});
  	
  	//the tile map is the actual area that *can* be displayed:  32 px X 96 blocks 
  	tile_map  = new jaws.TileMap({size: [width, height], cell_size: [32,32]});
  	
  	//Fit all items in array blocks into correct cells in the tilemap
  	//Later on we can look them up really fast
  	tile_map.push(grass_blocks);
  	
  	/* Player setup. */
  	player = new Player(500,1000);
  	
    /* Player HUD setup. */
    player_hud = new HUD(player);
    
    /* Prepare random item generation */
    generate_random_item(5); //every 5 seconds
       
	//jaws.on_keydown("esc",  function() { jaws.switchGameState(MenuState) })
    jaws.preventDefaultKeys(["up", "down", "left", "right", "space"])
  }


  this.update = function() {
  	lanterns.update();
  	player_hud.update();    
  	player.update();
  	
  	// Game over!
  	if(player.zombieLevel == 8) {
  		jaws.switchGameState(GameOverState);
  	}
  	
    
    /* ---- handle input and check for building collisions ----- */
    var delta_x = 0;
    var delta_y = 0;

    if(jaws.pressed("left"))
    {
    	if(jaws.pressed("up") || jaws.pressed("down")) {
    		delta_x = -sqrt_sixteen_halves; 
    		// diagonal_delta = 4, so: 4^2 = x^2 + y^2 => 16 = 2*x^2 => sqrt(16/2) = x 
    	}
    	else {
    		delta_x = -4;
    	}
    	
        player.sprite.x += delta_x;
        player.facingHorizontally = true;
    	player.sprite.setImage(player.anim_walk_left.next());
    }
    
    else if(jaws.pressed("right")) 
    { 
    	if(jaws.pressed("up") || jaws.pressed("down")) {
    		delta_x = sqrt_sixteen_halves; 
    		// diagonal_delta = 3, so: 3^2 = x^2 + y^2 => 9 = 2*x^2 => sqrt(9/2) = x 
    	}
    	else {
    		delta_x = 4;
    	}

        player.sprite.x += delta_x;
        player.facingHorizontally = true;
    	player.sprite.setImage(player.anim_walk_right.next());
    }
    
    
    if(jaws.pressed("up"))    
    {
    	if(jaws.pressed("left") || jaws.pressed("right")) {
    		delta_y = -sqrt_sixteen_halves; 
			// diagonal_delta = 3, so: 3^2 = x^2 + y^2 => 9 = 2*y^2 => sqrt(9/2) = y 
    	}
    	else {
    		delta_y = -4;
    	}
    	    	
        player.sprite.y += delta_y;
        player.facingHorizontally = false;
    	player.sprite.setImage(player.anim_walk_up.next()); 
    }
    
    
    else if(jaws.pressed("down"))  
    { 
    	if(jaws.pressed("left") || jaws.pressed("right")) {
    		delta_y = sqrt_sixteen_halves; 
    		// diagonal_delta = 3, so: 3^2 = x^2 + y^2 => 9 = 2*y^2 => sqrt(9/2) = y 
    	}
    	else {
    		delta_y = 4;
    	}
    	
        player.sprite.y += delta_y;
        player.facingHorizontally = false;
    	player.sprite.setImage(player.anim_walk_down.next());
    }
    /* ===================================================================== */    
    
    //if the player collided with buildings, revert the move
    buildings.forEach(function(building, index, array) {
    	if(jaws.collideOneWithMany(player,building.colliders).length > 0) {
    		player.sprite.x -= delta_x;
    		player.sprite.y -= delta_y;
    		playerCollidedWithBuilding = true;
    	}
    }); 
   
    lanterns.forEach(function(lantern, index, array) {

    	//if the player collided with a lamppost, revert the move
    	if(jaws.collideOneWithOne(player, lantern.post)) {
    		player.sprite.x -= delta_x;
    		player.sprite.y -= delta_y;
    		playerCollidedWithLantern = true;
    	}
    	
    	// also check for presence within light
    	if(jaws.collideCircles(player, lantern)) {
    		playerInLanternLight = true;
    		
    		//we accumulate the time you've spent inside
    		player.timeSpentInLight += jaws.game_loop.tick_duration;
    		
    		//if the player has spent more than 1 second in the light,
    		if(player.timeSpentInLight > 1000.0) {
    			//reset the player's light counter,
    			player.timeSpentInLight = 0.0;
    			
    			//and give the player a light boost
    			player.lightExposure += 25.0
    		}
    		
    	}
    });
    
    
    playerCollidedWithMedpac    = check_collided_and_remove(player,medpacs);
    playerCollidedWithBottlecap = check_collided_and_remove(player,bottlecaps);
    playerCollidedWithRations   = check_collided_and_remove(player,rations);
    playerCollidedWithWaters    = check_collided_and_remove(player,waters);
   
    if(playerCollidedWithMedpac) {player.medicineLife += 25.0;}
    if(playerCollidedWithBottlecap) {player.numberOfBottlecapsCollected++;}
    if(playerCollidedWithRations) {player.numberOfRationsCollected++;}
    if(playerCollidedWithWaters) {player.numberOfWatersCollected++;}
    if(!playerInLanternLight) {player.timeSpentInLight = 0.0;}   
       
    /* Set general collision flag */
    playerDidCollide = (playerCollidedWithMedpac || playerCollidedWithBottlecap || 
    	playerCollidedWithRations || playerCollidedWithWaters || playerCollidedWithBoundary || 
    	playerCollidedWithBuilding || playerCollidedWithShrubbery || playerCollidedWithLantern || 
    	playerInLanternLight);
    
    player.applyDamage();
    reset_event_flags();    
       
    // Final checks:
    viewport.centerAround(player.sprite);
    force_inside_canvas(player.sprite);
    fps.innerHTML = jaws.game_loop.fps
    
	//Logging:
    jaws.log("Player at x:"+player.sprite.x+", y:"+player.sprite.y);
    
  }


  this.draw = function() {
    jaws.context.clearRect(0,0,jaws.width,jaws.height);
    
    viewport.drawTileMap(tile_map);
    
    viewport.apply(function() {
        buildings.draw();
        roads.draw();
        player.draw();
        lanterns.draw();
        medpacs.draw();
        bottlecaps.draw();
        rations.draw();
        waters.draw();
        boundaries.draw();
	});
   
    player_hud.draw();
    
  }
  
  function generate_random_item(seconds_delay) {
  	
  	if(medpacs.length + bottlecaps.length + rations.length + waters.length < MAX_NUMBER_OF_ITEMS)
  	{
  		//only generate an item if we have less than 16 on the battle field
  		var list;
  		var list_item="CHANGEME";
  		
  		switch(get_random_int(0,4))
  		{
  			case 0:
  				list = medpacs;
  				list_item=list_item.replace("CHANGEME", "medpac");
  				break;
  				
  			case 1:
  				list = bottlecaps;
  				list_item=list_item.replace("CHANGEME", "bottlecap");
  				break;
  			
  			case 2:
  				list = rations;
  				list_item=list_item.replace("CHANGEME", "rations");
  				break;
  			
  			case 3:
  				list = waters;
  				list_item=list_item.replace("CHANGEME", "water");
  				break;
  			
  			default:
  				break; 
  		}
  		
  		var item_position;
  		do {
  			item_position = get_random_int(0,MAX_NUMBER_OF_ITEMS);
  		} while(!item_position_is_available(item_position));
  		
  		//now that we've found a position, let's reserve it:
  		acceptable_item_positions[item_position][2] = true;
  		
  		//at this point, we've decided what item to generate, and where is the item's anchor.
  		//now we're going to add some random offset to spice things up.
  		var xoffset = 50 * random_sigmoid();
  		var yoffset = 50 * random_sigmoid();
  		var x = acceptable_item_positions[item_position][0] + xoffset;
  		var y = acceptable_item_positions[item_position][1] + yoffset;
  		
  		//Item generation!
  		list.push(new Item({type:list_item, x:x, y:y, position_id:item_position}));
  		
  	}
  	
  	setTimeout(function(){generate_random_item(seconds_delay);}, seconds_delay*1000);
  }


  /**
   * Reset all event flags associated with collision detection.
   */
  function reset_event_flags() {
  	playerDidCollide = false;
  	playerCollidedWithMedpac    = false;
  	playerCollidedWithBottlecap = false;
  	playerCollidedWithRations   = false;
  	playerCollidedWithWaters    = false;
  	playerCollidedWithBoundary  = false;
  	playerCollidedWithBuilding  = false;
  	playerCollidedWithShrubbery = false;
  	playerCollidedWithLantern   = false;
  	playerInLanternLight = false;
  }
  
  
  /** 
   * Tests whether or not 'item' is outside the game's canvas.
   * @param {Object} item an object that has a coordinate
   * @return True if the object is outside the canvas
   */
  function is_outside_canvas(item) { 
    return (item.x < 0 || item.y < 0 || item.x > game_width_pixels || item.y > game_height_pixels); 
  }
    
  
  /**
   * Forces an 'item' inside the canvas by placing it at the canvas' border
   * when it tries to escape.
   * @param {Object} item an object that has a coordinate
   */
  function force_inside_canvas(item) {
    if(item.x - item.width < 0)                     { item.x = 0 + item.width;  }
    if(item.x + item.width > game_width_pixels)     { item.x = game_width_pixels - item.width; }
    if(item.y - item.height < 0)                    { item.y = 0 + item.height; }
    if(item.y + item.height  > game_height_pixels)  { item.y = game_height_pixels - item.height; }
  }
  
  
  /**
   * Check if there was a collision between a single object 'object' and the 
   * objects of list 'list'.  If there was, return true and remove the
   * collided objects from 'list'; return false otherwise.
   * Also, clean up the item's location to generate new items there.
   * @param {Object} object an object that can be collided against
   * @param {List} list a list of objects that can be collided against
   * @return true if the object collided against anything in the list  
   */
  function check_collided_and_remove(object, list) {
  
  	var collided_objects = jaws.collideOneWithMany(object, list);
  	
  	if(collided_objects.length > 0) {
  		collided_objects.forEach(function(item){
  			list.remove(item);
  			acceptable_item_positions[item.position_id][2]=false;
  		});
  		return true;
  	}
  	
  	else {
  		return false;
  	}
  }

 
  /**
   * Returns a random integer between min and max (exclusive)
   * Using Math.round() will give you a non-uniform distribution!
   */
  function get_random_int(min, max) {
  	return Math.floor(Math.random() * (max - min)) + min;
  }
  
  function item_position_is_available(position_index) {
  	return !acceptable_item_positions[position_index][2];
  }
  

  /* -------------------- Auxiliary Setup Functions -------------------- */
  function setup_background_tiles() {
    var backgroundTiles = new jaws.SpriteList();
    
    for(var xIndex = 0; xIndex < width; xIndex++) {
        for(var yIndex = 0; yIndex < height; yIndex++) {
            backgroundTiles.push( new jaws.Sprite({image: "./assets/art/grass.png", x: xIndex*32, y: yIndex*32}) );
        }
    }
    
    return backgroundTiles;
  }
  
  
  function setup_road_tiles() {
  	var roadTiles = new jaws.SpriteList();
  	
  	for(var yIndex = 0; yIndex < 9; yIndex++) {
  		roadTiles.push( new jaws.Sprite({image: "./assets/art/driveway.png", 
  											 x:game_width_pixels*.9/3,
  											 y:(game_height_pixels*yIndex/9)}));
  	}
  	
  	for(var xIndex = 4.5; xIndex < 12; xIndex++) {
  		roadTiles.push( new jaws.Sprite({image: "./assets/art/driveway.png", 
  									   x:xIndex*(game_width_pixels/11),
  									   y:(game_height_pixels*.95/2),
  									   angle:90}));
  	}
  	
  	for(var yIndex = 0; yIndex < 5; yIndex++) {
  		roadTiles.push( new jaws.Sprite({image: "./assets/art/driveway.png", 
  											 x:game_width_pixels*3.335/4,
  											 y:(game_height_pixels*yIndex/11.2)}));
  	}
  	  	
  	return roadTiles;
  }
  
  
  function setup_lanterns() {
  	var lanterns = new jaws.SpriteList();
  	
	lanterns.push( new Lantern(jaws.width*3.43/4, game_height_pixels*1.3/4, true) );
	lanterns.push( new Lantern(jaws.width*3.43/4, game_height_pixels*3.24/4, true) );
	lanterns.push( new Lantern(game_width_pixels*1.5/4, game_height_pixels*1.435/4, false) );
	lanterns.push( new Lantern(game_width_pixels*2.49/4, game_height_pixels*1.82/4, true) );
	lanterns.push( new Lantern(game_width_pixels*3.185/4, game_height_pixels*2.33/4, true) );
	lanterns.push( new Lantern(game_width_pixels*2.042/4, game_height_pixels*2.33/4, true) );
	lanterns.push( new Lantern(game_width_pixels*1.5/4, game_height_pixels*2.65/4, false) );
	lanterns.push( new Lantern(game_width_pixels*1.158/4, game_height_pixels*2.0425/4, false) );
	lanterns.push( new Lantern(game_width_pixels*3.75/4, game_height_pixels*1.82/4, false) );
	lanterns.push( new Lantern(game_width_pixels*3.185/4, game_height_pixels*1.82/4, false) );

  	return lanterns;
  }
  
  
  function setup_buildings() {
  	var buildings = new jaws.SpriteList();
  	
  	buildings.push( new Building({type:1,x:game_width_pixels/4.5,y:game_height_pixels/4}));
	buildings.push( new Building({type:2,x:game_width_pixels*5/8,y:game_height_pixels*3/8}));
	buildings.push( new Building({type:3,x:game_width_pixels*3.4/4.5,y:game_height_pixels*1/8}));
	buildings.push( new Building({type:3,x:game_width_pixels/4.6,y:game_height_pixels*6/8}));
	buildings.push( new Building({type:4,x:game_width_pixels*4.5/8,y:game_height_pixels*5.9/9}));
	buildings.push( new Building({type:5,x:game_width_pixels*6.3/8,y:game_height_pixels*6.2/9}));
	
	return buildings;
  }
  
  
  function setup_boundaries() {
  	var boundaries = new jaws.SpriteList();
  	
  	var offset = 35;
	var leftWall = new Building({type:6,x:offset,y:(game_height_pixels/2)});
	leftWall.sprite.setWidth(game_height_pixels);
	leftWall.sprite.rotate(90);
	
	
	var rightWall = new Building({type:6,x:(game_width_pixels-offset),y:(game_height_pixels/2)});
	rightWall.sprite.setWidth(game_height_pixels);
	rightWall.sprite.rotate(90);
	
	var topWall = new Building({type:6,x:(game_width_pixels/2),y:(offset)});
	topWall.sprite.setWidth(game_width_pixels);
	
	var bottomWall = new Building({type:6,x:(game_width_pixels/2),y:(game_height_pixels-offset)});
	bottomWall.sprite.setWidth(game_width_pixels);
	
	boundaries.push(leftWall);
	boundaries.push(rightWall);
	boundaries.push(topWall);
	boundaries.push(bottomWall);
	
	return boundaries;
  }
  
  function setup_acceptable_item_positions() {
  	
  	var acceptable_item_positions = new Array(MAX_NUMBER_OF_ITEMS);
  	
  	for(var rowIndex = 0; rowIndex < MAX_NUMBER_OF_ITEMS; rowIndex++) {
  		acceptable_item_positions[rowIndex] = new Array(3);
  	}

	acceptable_item_positions[0][0] = 210;
	acceptable_item_positions[0][1] = 445;
	acceptable_item_positions[0][2] = false; //not occupied
	
	acceptable_item_positions[1][0] = 335;
	acceptable_item_positions[1][1] = 720;
	acceptable_item_positions[1][2] = false; //not occupied

	acceptable_item_positions[2][0] = 575;
	acceptable_item_positions[2][1] = 1530;
	acceptable_item_positions[2][2] = false; //not occupied

	acceptable_item_positions[3][0] = 850;
	acceptable_item_positions[3][1] = 880;
	acceptable_item_positions[3][2] = false; //not occupied

	acceptable_item_positions[4][0] = 980;
	acceptable_item_positions[4][1] = 1465;
	acceptable_item_positions[4][2] = false; //not occupied

	acceptable_item_positions[5][0] = 1040;
	acceptable_item_positions[5][1] = 1275;
	acceptable_item_positions[5][2] = false; //not occupied

	acceptable_item_positions[6][0] = 1100;
	acceptable_item_positions[6][1] = 405;
	acceptable_item_positions[6][2] = false; //not occupied

	acceptable_item_positions[7][0] = 1100;
	acceptable_item_positions[7][1] = 780;
	acceptable_item_positions[7][2] = false; //not occupied

	acceptable_item_positions[8][0] = 1300;
	acceptable_item_positions[8][1] = 1400;
	acceptable_item_positions[8][2] = false; //not occupied

	acceptable_item_positions[9][0] = 1540;
	acceptable_item_positions[9][1] = 1295;
	acceptable_item_positions[9][2] = false; //not occupied
	
	acceptable_item_positions[10][0] = 1575;
	acceptable_item_positions[10][1] = 925;
	acceptable_item_positions[10][2] = false; //not occupied

	acceptable_item_positions[11][0] = 1745;
	acceptable_item_positions[11][1] = 600;
	acceptable_item_positions[11][2] = false; //not occupied

	acceptable_item_positions[12][0] = 2000;
	acceptable_item_positions[12][1] = 400;
	acceptable_item_positions[12][2] = false; //not occupied

	acceptable_item_positions[13][0] = 2000;
	acceptable_item_positions[13][1] = 900;
	acceptable_item_positions[13][2] = false; //not occupied

	acceptable_item_positions[14][0] = 2100;
	acceptable_item_positions[14][1] = 1100;
	acceptable_item_positions[14][2] = false; //not occupied

	acceptable_item_positions[15][0] = 588;
	acceptable_item_positions[15][1] = 1100;
	acceptable_item_positions[15][2] = false; //not occupied
	
	return acceptable_item_positions;
  }
  
}

