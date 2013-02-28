/*
 *
 * PlayState is the actual game play. 
 * We switch to it once user choses "Start game"
 *
 */
function PlayState() {
  var player;
  var player_face;
  var face_anim;
  var grass_blocks;
  var roads      = new jaws.SpriteList();
  var trees		 = new jaws.SpriteList();
  var lanterns   = new jaws.SpriteList();
  var buildings  = new jaws.SpriteList();
  var boundaries = new jaws.SpriteList();
  var medpacs    = new jaws.SpriteList();
  var width  = 72;
  var height = 54;
  var game_width_pixels  = width*32;
  var game_height_pixels = height*32;
  var viewport;
  var tile_map;
  // var background;
  

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
  	player = new Player(game_width_pixels/2,game_height_pixels/2 + 40);
  	
    /* Player face setup - HUD */
   face_anim = new jaws.Animation({sprite_sheet: "./assets/art/status_faces.png", frame_size:[215,215],loop:false});
   player_face = new jaws.Sprite({x:718, y:50, anchor:"center", scale: 0.5});
   player_face.setImage(face_anim.next());
   
    
    /* Lantern setup. */
	lanterns.push( new Lantern(jaws.width*3/4, jaws.height*3/2, false) );
	lanterns.push( new Lantern(2*jaws.width*3/4, jaws.height*3/2, true) );
	lanterns.push( new Lantern(3*jaws.width*3/4, jaws.height*3/2, false) );
	
	
	/* House setup. */
	buildings.push( new House({type:1,x:game_width_pixels/4.5,y:game_height_pixels/4}));
	buildings.push( new House({type:2,x:game_width_pixels*5/8,y:game_height_pixels*3/8}));
	buildings.push( new House({type:3,x:game_width_pixels/4.6,y:game_height_pixels*6/8}));
	buildings.push( new House({type:4,x:game_width_pixels*4.5/8,y:game_height_pixels*6/9}));
	buildings.push( new House({type:5,x:game_width_pixels*6.3/8,y:game_height_pixels*6.2/9}));
	

	/* Test Medpac setup*/
	medpacs.push( new Medpac(1000,350) );
	medpacs.push( new Medpac(500,680) );
	
	
	/* ------------------- Boundaries setup. ------------------- */
	var offset = 35;
	var leftWall = new House({type:6,x:offset,y:(game_height_pixels/2)});
	leftWall.sprite.setWidth(game_height_pixels);
	leftWall.sprite.rotate(90);
	
	
	var rightWall = new House({type:6,x:(game_width_pixels-offset),y:(game_height_pixels/2)});
	rightWall.sprite.setWidth(game_height_pixels);
	rightWall.sprite.rotate(90);
	
	var topWall = new House({type:6,x:(game_width_pixels/2),y:(offset)});
	topWall.sprite.setWidth(game_width_pixels);
	
	var bottomWall = new House({type:6,x:(game_width_pixels/2),y:(game_height_pixels-offset)});
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
    console.log("Player life: " + player.life);
    console.log("Player medicine life: " + player.medicineLife);  
    
      
  	lanterns.update();
    
    var playerDidCollide = false;
    
    
    /* ---- handle input and check for building collisions ----- */
    var playerCollidedWithBuilding = false;
    
    if(jaws.pressed("left"))
    {
        player.sprite.x -= 3;
        player.facingHorizontally = true;
        
        //if the player collided, revert the move
        if(jaws.collideOneWithMany(player,buildings).length > 0) {
            player.sprite.x += 3;
            playerCollidedWithBuilding = true;
        }
        
		if(jaws.collideOneWithMany(player,lanterns).length > 0) {
        	player.sprite.x += 3;
        	playerCollidedWithLantern = true;
        }

            	 
    	player.sprite.setImage(player.anim_walk_left.next());
    }
    
    else if(jaws.pressed("right")) 
    { 
        player.sprite.x += 3;
        player.facingHorizontally = true;
        
        //if the player collided, revert the move
        if(jaws.collideOneWithMany(player,buildings).length > 0) {
            player.sprite.x -= 3;    
            playerCollidedWithBuilding = true;
        }
        
		if(jaws.collideOneWithMany(player,lanterns).length > 0) {
        	player.sprite.x -= 3;
        	playerCollidedWithLantern = true;
        }

    	player.sprite.setImage(player.anim_walk_right.next());
    }
    
    
    if(jaws.pressed("up"))    
    {
        player.sprite.y -= 3;
        player.facingHorizontally = false;
        
        //if the player collided, revert the move
        if(jaws.collideOneWithMany(player,buildings).length > 0) {
            player.sprite.y += 3;    
            playerCollidedWithBuilding = true;
        }
        
		if(jaws.collideOneWithMany(player,lanterns).length > 0) {
        	player.sprite.y += 3;
        	playerCollidedWithLantern = true;
        }
    	
    	player.sprite.setImage(player.anim_walk_up.next()); 
    }
    
    
    else if(jaws.pressed("down"))  
    { 
        player.sprite.y += 3;
        player.facingHorizontally = false;
        
        //if the player collided, revert the move
        if(jaws.collideOneWithMany(player,buildings).length > 0) {
            player.sprite.y -= 3;
            playerCollidedWithBuilding = true;    
        }
        
        if(jaws.collideOneWithMany(player,lanterns).length > 0) {
        	player.sprite.y -= 3;
        	playerCollidedWithLantern = true;
        }

    	player.sprite.setImage(player.anim_walk_down.next());
    }
    /* ========================================================= */
    
    



    
    /* --------- check collisions against all lanterns --------- */
    var playerCollidedWithLantern = false;
    
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
    
    
    
    
    
    
    /* set collision flags */
    playerDidCollide = (playerCollidedWithLantern || playerCollidedWithBuilding);
    
    
    
    /* ------------- do player damage calculations ------------- */
    if(player.medicineLife > 75 && playerCollidedWithLantern) {
       //TODO QUESTION:  How do I penalize players with too much medicine?
       player.life -= player.diseasePenalty;
    }
   
    else if(player.medicineLife > 0) {
       player.medicineLife -= player.diseasePenalty;
    }
   
    else {
       player.life -= player.diseasePenalty;
    }
   /* ========================================================= */
  
  
    
    /* check the player's life, and change the player's face accordingly */
    updatePlayerLifeIndicator(player, player_face);
    
    
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
        buildings.draw();
        roads.draw();
        player.draw();
        lanterns.draw();
        medpacs.draw();
        boundaries.draw();
        });
        
    player_face.draw();
  }
  
  
  /* 
   * Auxiliary player functions
   */
  function updatePlayerLifeIndicator(player, player_face) {
      //check the player's life, and change the player's face accordingly
    if(player.life > 87.5) {
        player_face.setImage(face_anim.frames[0]);
    }
    
    else if(player.life > 75) {
        player_face.setImage(face_anim.frames[1]);
    }
    
    else if(player.life > 62.5) {
        player_face.setImage(face_anim.frames[2]);
    }
    
    else if(player.life > 50) {
        player_face.setImage(face_anim.frames[3]);
    }
    
    else if(player.life > 37.5) {
        player_face.setImage(face_anim.frames[4]);
    }
    
    else if(player.life > 25) {
        player_face.setImage(face_anim.frames[5]);
    }
    
    else if(player.life > 12.5) {
        player_face.setImage(face_anim.frames[6]);
    }
    
    else {
    	player_face.setImage(face_anim.frames[7]);
    }
    
  }
  
  
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
  		roadTiles.push( new jaws.Sprite({image: "./assets/art/driveway.png", x:game_width_pixels*.9/3,y:(game_height_pixels*yIndex/9)}));
  	}
  	  	
  	return roadTiles;
  }


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