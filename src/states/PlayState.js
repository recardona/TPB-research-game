/*
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
  var other_items  = new jaws.SpriteList();
  var sqrt_nine_halves = Math.sqrt(9/2);
  var width  = 72;
  var height = 54;
  var game_width_pixels  = width*32;
  var game_height_pixels = height*32;
  var viewport;
  var tile_map;
  
  this.setup = function() {
  	
  	/* Background setup. */
	roads = setupRoadTiles();
  	grass_blocks = setupBackgroundTiles();
  	
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
    
    
   
    /* Lantern setup. */ 
    lanterns = setupLanterns();
    
	/* Building setup. */
	buildings = setupBuildings();

	/* Test Medpac setup*/
	// medpacs.push( new Medpac(500,670) );
	// medpacs.push( new Medpac(500,740) );
	medpacs.push(new Item({type:"medpac", x:500, y:670}));
	
	other_items.push(new Item({type:"bottlecap", x:600, y:670}));
	other_items.push(new Item({type:"rations", x:600, y:770}));
	other_items.push(new Item({type:"water", x:500, y:770}));
	
	
	
	
	
	/* ------------------- Boundaries setup. ------------------- */
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
	/* ========================================================= */
	
	
	
	jaws.on_keydown("esc",  function() { jaws.switchGameState(MenuState) })
    jaws.preventDefaultKeys(["up", "down", "left", "right", "space"])
  }


  this.update = function() {
    // console.log("Position: (" + player.sprite.x + ", " + player.sprite.y +")");
    // console.log("Player life: " + player.life);
    // console.log("Player medicine life: " + player.medicineLife);  
    
      
  	lanterns.update();
  	player_hud.update();
    
    var playerDidCollide = false;
    var playerCollidedWithBuilding  = false;
    var playerCollidedWithLantern   = false;
    var playerCollidedWithBoundary  = false;
    var playerCollidedWithShrubbery = false;
    /* ---- handle input and check for building collisions ----- */
    
    if(jaws.pressed("left"))
    {
		var delta_x = 0;
    	if(jaws.pressed("up") || jaws.pressed("down")) {
    		delta_x = sqrt_nine_halves; 
    		// I have to move 3 diagonally, so each of the components(x and y)
    		// have to be identical, and both less than 3.  diagonal_delta = 3, so:
    		// 3^2 = x^2 + y^2 => 9 = 2*x^2 => sqrt(9/2) = x 
    	}
    	else {
    		delta_x = 3;
    	}
    	
        player.sprite.x -= delta_x;
        player.facingHorizontally = true;
        
        //if the player collided, revert the move
  		buildings.forEach(function(building,index,array) {
  			if(jaws.collideOneWithMany(player, building.colliders).length > 0) {
	            player.sprite.x += delta_x;
	            playerCollidedWithBuilding = true;
  			}
  		});
  		
		if(jaws.collideOneWithMany(player,lanterns).length > 0) {
        	player.sprite.x += delta_x;
        	playerCollidedWithLantern = true;
        }

            	 
    	player.sprite.setImage(player.anim_walk_left.next());
    }
    
    else if(jaws.pressed("right")) 
    { 
    	var delta_x = 0;
    	if(jaws.pressed("up") || jaws.pressed("down")) {
    		delta_x = sqrt_nine_halves; 
    		// I have to move 3 diagonally, so each of the components(x and y)
    		// have to be identical, and both less than 3.  diagonal_delta = 3, so:
    		// 3^2 = x^2 + y^2 => 9 = 2*x^2 => sqrt(9/2) = x 
    	}
    	else {
    		delta_x = 3;
    	}

        player.sprite.x += delta_x;
        player.facingHorizontally = true;
        
        //if the player collided, revert the move
		buildings.forEach(function(building,index,array) {
  			if(jaws.collideOneWithMany(player, building.colliders).length > 0) {
	            player.sprite.x -= delta_x;
	            playerCollidedWithBuilding = true;
  			}
  		});
        
		if(jaws.collideOneWithMany(player,lanterns).length > 0) {
        	player.sprite.x -= delta_x;
        	playerCollidedWithLantern = true;
        }

    	player.sprite.setImage(player.anim_walk_right.next());
    }
    
    
    if(jaws.pressed("up"))    
    {
    	var delta_y = 0;
    	if(jaws.pressed("left") || jaws.pressed("right")) {
    		delta_y = sqrt_nine_halves; 
    		// I have to move 3 diagonally, so each of the components(x and y)
    		// have to be identical, and both less than 3.  diagonal_delta = 3, so:
    		// 3^2 = x^2 + y^2 => 9 = 2*y^2 => sqrt(9/2) = y 
    	}
    	else {
    		delta_y = 3;
    	}
    	    	
        player.sprite.y -= delta_y;
        player.facingHorizontally = false;
        
        //if the player collided, revert the move
		buildings.forEach(function(building,index,array) {
  			if(jaws.collideOneWithMany(player, building.colliders).length > 0) {
	            player.sprite.y += delta_y;
	            playerCollidedWithBuilding = true;
  			}
  		});
        
		if(jaws.collideOneWithMany(player,lanterns).length > 0) {
        	player.sprite.y += delta_y;
        	playerCollidedWithLantern = true;
        }
    	
    	player.sprite.setImage(player.anim_walk_up.next()); 
    }
    
    
    else if(jaws.pressed("down"))  
    { 
		var delta_y = 0;
    	if(jaws.pressed("left") || jaws.pressed("right")) {
    		delta_y = sqrt_nine_halves; 
    		// I have to move 3 diagonally, so each of the components(x and y)
    		// have to be identical, and both less than 3.  diagonal_delta = 3, so:
    		// 3^2 = x^2 + y^2 => 9 = 2*y^2 => sqrt(9/2) = y 
    	}
    	else {
    		delta_y = 3;
    	}

    	
        player.sprite.y += delta_y;
        player.facingHorizontally = false;
        
        //if the player collided, revert the move
		buildings.forEach(function(building,index,array) {
  			if(jaws.collideOneWithMany(player, building.colliders).length > 0) {
	            player.sprite.y -= delta_y;
	            playerCollidedWithBuilding = true;
  			}
  		});
        
        if(jaws.collideOneWithMany(player,lanterns).length > 0) {
        	player.sprite.y -= delta_y;
        	playerCollidedWithLantern = true;
        }

    	player.sprite.setImage(player.anim_walk_down.next());
    }
    /* ========================================================= */
    
    



    
    /* --------- check collisions against all lanterns --------- */
    
    if(jaws.collideOneWithMany(player,lanterns).length > 0) {
        player.diseasePenalty = 0.001; //while inside, the disease acts slower...
        playerCollidedWithLantern = true;
        
        if(player.medicineLife > 75) {
            //...unless you have too much medicine, in which case it acts faster!
            player.diseasePenalty = 0.1; // X_X
        }
    }
    
    else {
        player.diseasePenalty = 0.01; //if not, the disease resumes its course >_<
    }
    /* ========================================================= */
   
   
   
    
    
    
    /* --------- check collisions against all medpacs --------- */
    var playerCollidedWithMedpac = false;
    var collided_medpacs = jaws.collideOneWithMany(player,medpacs);
    
    if(collided_medpacs.length > 0) {
        collided_medpacs.forEach(function(medpac) {
            medpacs.remove(medpac);
            player.medicineLife += 10;
        });
    }
       
    /* ========================================================= */
   
   
   
   
   
    /* --------- check collisions against all other items --------- */
    var playerCollidedWithOtherItem = false;
    var collided_items = jaws.collideOneWithMany(player,other_items);
    
    if(collided_items.length > 0) {
        collided_items.forEach(function(item) {
            other_items.remove(item);
        });
    }
       
    /* ========================================================= */
   
   
    
    
    
    
    
    /* set collision flags */
    playerDidCollide = (playerCollidedWithLantern || playerCollidedWithBuilding);
    
    
    /* ------------- do player damage calculations ------------- */
    if(player.medicineLife > 75 && playerCollidedWithLantern) {
       player.life -= player.diseasePenalty;
    }
   
    else if(player.medicineLife > 0) {
       player.medicineLife -= player.diseasePenalty;
       
    }
   
    else {
       player.life -= player.diseasePenalty;
    }
    
    /* Sanity checks: */
    if(player.medicineLife > 100) {
    	player.medicineLife = 100;
    }
    
	if(player.medicineLife < 0) {
		player.medicineLife = 0;
    }
    
    if(player.life > 100) {
    	player.life = 100;
    }
    
    console.log(player.medicineLife);


    
    
   /* ========================================================= */
  
  
    
    
    
    viewport.centerAround(player.sprite);
    forceInsideCanvas(player.sprite)
    // bullets.removeIf(isOutsideCanvas) // delete items for which isOutsideCanvas(item) is true
    
    fps.innerHTML    = jaws.game_loop.fps
    
    /* reset flags */
    playerDidCollide = false;
    playerCollidedWithLantern = false;
    playerCollidedWithBuilding = false;
  }


  this.draw = function() {
    jaws.context.clearRect(0,0,jaws.width,jaws.height);
    
    viewport.drawTileMap(tile_map);
    
    viewport.apply(function() {
        roads.draw();
        buildings.draw();
        player.draw();
        lanterns.draw();
        medpacs.draw();
        other_items.draw();
        boundaries.draw();
	});
   
    player_hud.draw();
    
  }
  
 
  
  /* ------------- Auxiliary Setup Functions ------------- */
  function setupBackgroundTiles() {
    var backgroundTiles = new jaws.SpriteList();
    
    for(var xIndex = 0; xIndex < width; xIndex++) {
        for(var yIndex = 0; yIndex < height; yIndex++) {
            backgroundTiles.push( new jaws.Sprite({image: "./assets/art/grass.png", x: xIndex*32, y: yIndex*32}) );
        }
    }
    
    return backgroundTiles;
  }
  
  
  function setupRoadTiles() {
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
  	  	
  	return roadTiles;
  }
  
  
  function setupLanterns() {
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
  
  
  function setupBuildings() {
  	var buildings = new jaws.SpriteList();
  	
  	buildings.push( new Building({type:1,x:game_width_pixels/4.5,y:game_height_pixels/4}));
	buildings.push( new Building({type:2,x:game_width_pixels*5/8,y:game_height_pixels*3/8}));
	buildings.push( new Building({type:3,x:game_width_pixels/4.6,y:game_height_pixels*6/8}));
	buildings.push( new Building({type:4,x:game_width_pixels*4.5/8,y:game_height_pixels*5.9/9}));
	buildings.push( new Building({type:5,x:game_width_pixels*6.3/8,y:game_height_pixels*6.2/9}));
	
	return buildings;
  }
  /* ========================================================= */


  /* Simular to example1 but now we're using jaws properties to get width and height of canvas instead */
  /* This mainly since we let jaws handle the canvas now */
  function isOutsideCanvas(item) { 
    return (item.x < 0 || item.y < 0 || item.x > game_width_pixels || item.y > game_height_pixels); 
  }
    
    
  function forceInsideCanvas(item) {
    if(item.x - item.width < 0)                     { item.x = 0 + item.width;  }
    if(item.x + item.width > game_width_pixels)     { item.x = game_width_pixels - item.width; }
    if(item.y - item.height < 0)                    { item.y = 0 + item.height; }
    if(item.y + item.height  > game_height_pixels)  { item.y = game_height_pixels - item.height; }
  }

}