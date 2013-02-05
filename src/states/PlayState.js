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
  var lanterns  = new jaws.SpriteList();
  var zombies   = new jaws.SpriteList();
  var buildings = new jaws.SpriteList();
  var width  = 72;
  var height = 54;
  var game_width_pixels  = width*32;
  var game_height_pixels = height*32;
  var viewport;
  var tile_map;
  // var background;
  

  this.setup = function() {
  	
  	/* Background setup. */
  	grass_blocks = setupBackgroundTiles();
  	
  	//the viewport is all the viewable area of a larger tilemap.  It allows scrolling.
  	viewport  = new jaws.Viewport({max_x:width*32, max_y:height*32});
  	
  	//the tile map is the actual area that *can* be displayed:  32 px X 96 blocks 
  	tile_map  = new jaws.TileMap({size: [width, height], cell_size: [32,32]});
  	
  	//Fit all items in array blocks into correct cells in the tilemap
  	//Later on we can look them up really fast
  	tile_map.push(grass_blocks);
  	
  	/* Player setup. */
  	player = new Player(10,100);
  	
    /* Player face setup - HUD */
   face_anim = new jaws.Animation({sprite_sheet: "./assets/art/status_faces.png", frame_size:[215,215],loop:false});
   player_face = new jaws.Sprite({x:718, y:50, anchor:"center", scale: 0.5});
   player_face.setImage(face_anim.next());
   
    
    /* Lantern setup. */
	lanterns.push( new Lantern(jaws.width*3/4, jaws.height*3/2) );
	lanterns.push( new Lantern(2*jaws.width*3/4, jaws.height*3/2) );
	lanterns.push( new Lantern(3*jaws.width*3/4, jaws.height*3/2) );
	// tile_map.push(lanterns);
	
	/* Zombie setup. */
	// zombies.push( new Zombie(200,100) );
	// zombies.push( new Zombie(100,300) );
	// zombies.push( new Zombie(100,500) );
// 	
	/* Building setup. */
	buildings.push( new Building({type:4,x:200,y:350}));
	buildings.push( new Building({type:3,x:550,y:350}));
	buildings.push( new Building({type:2,x:330,y:680}));
	
	jaws.on_keydown("esc",  function() { jaws.switchGameState(MenuState) })
    jaws.preventDefaultKeys(["up", "down", "left", "right", "space"])
  }


  this.update = function() {
  	lanterns.update();
  	zombies.forEach(function(zombie, index, zombies) {
  	    seek(zombie,{x:player.x, y:player.y});
  	    // wander(zombie);
    });
    
    
    var playerDidCollide = false;
    
    /* handle input and check for building collisions */
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

    	player.sprite.setImage(player.anim_walk_down.next());
    }
    
    /* check collisions against all lanterns */
    var playerCollidedWithLantern = false;
    
    if(jaws.collideOneWithMany(player,lanterns).length > 0) {
        player.disease_penalty = 0.01; //while inside, the disease acts slower!
        playerCollidedWithLantern = true;
    }
    
    else {
        player.disease_penalty = 0.1; //if not, the disease resumes its course X_X
    }
        
    player.life -= player.disease_penalty;
    
    /* set collision flags */
    playerDidCollide = (playerCollidedWithLantern || playerCollidedWithBuilding);
    
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
        player.draw();
        lanterns.draw();
        zombies.draw();
        buildings.draw();
        });
        
    player_face.draw();
    
  }
  
  
  /* 
   * Auxiliary player functions
   */
  function updatePlayerLifeIndicator(player, player_face) {
      //check the player's life, and change the player's face accordingly
    if(player.life > 80) {
        player_face.setImage(face_anim.frames[0]);
    }
    
    else if(player.life > 60) {
        player_face.setImage(face_anim.frames[1]);
    }
    
    else if(player.life > 40) {
        player_face.setImage(face_anim.frames[2]);
    }
    
    else if(player.life > 20) {
        player_face.setImage(face_anim.frames[3]);
    }
    
    else if(player.life > 0) {
        player_face.setImage(face_anim.frames[4]);
    }
    
    else if(player.life < 0) {
        player_face.setImage(face_anim.frames[5]);
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