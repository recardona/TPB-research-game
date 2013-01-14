/*
 *
 * PlayState is the actual game play. We switch to it once user choses "Start game"
 *
 */
function PlayState() {
  var player;
  var player_face;
  var face_anim;
  var grass_blocks;
  var bullets  = new jaws.SpriteList();
  var lanterns = new jaws.SpriteList();;
  var width  = 72;
  var height = 54;
  var game_width_pixels  = width*32;
  var game_height_pixels = height*32;
  var viewport;
  var tile_map;
  // var background;
  

  this.setup = function() {
  	
  	/* Background setup. */
  	
  	grass_blocks = new jaws.SpriteList();
  	for(var xIndex = 0; xIndex < width; xIndex++) {
  	    for(var yIndex = 0; yIndex < height; yIndex++) {
  	        grass_blocks.push( new jaws.Sprite({image: "./assets/art/grass.png", x: xIndex*32, y: yIndex*32}) );
  	    }
  	}
  	
  	//the viewport is all the viewable area of a larger tilemap.  It allows scrolling.
  	viewport  = new jaws.Viewport({max_x:width*32, max_y:height*32});
  	
  	//the tile map is the actual area that *can* be displayed:  32 px X 96 blocks 
  	tile_map  = new jaws.TileMap({size: [width, height], cell_size: [32,32]});
  	
  	//Fit all items in array blocks into correct cells in the tilemap
  	//Later on we can look them up really fast
  	tile_map.push(grass_blocks);
  	
  	
  	
  	
  	/* Player setup. */
  	var player_horiz_anim = new jaws.Animation({sprite_sheet: "./assets/art/player_LR_spritesheet.png", frame_size:[57.571,84], loop:true});
  	var player_vert_anim = new jaws.Animation({sprite_sheet: "./assets/art/player_UD_spritesheet.png", frame_size:[74.714,54], loop:true});
   	
    player = new jaws.Sprite({x: 10, y:100, anchor:"center", scale: 0.75});
    player.radius = 20; //px - this radius is made available for circle-based collision
    player.life = 100;
    player.disease_penalty = 0.1;
    player.can_fire = true;
    player.anim_walk_left  = player_horiz_anim.slice(0,7);
    player.anim_walk_right = player_horiz_anim.slice(7,14);
    player.anim_walk_down  = player_vert_anim.slice(0,7);
    player.anim_walk_up    = player_vert_anim.slice(7,14);
    player.setImage(player.anim_walk_right.next());
    
    /* Player face setup - HUD */
   face_anim = new jaws.Animation({sprite_sheet: "./assets/art/status_faces.png", frame_size:[215,215],loop:false});
   player_face = new jaws.Sprite({x:718, y:50, anchor:"center", scale: 0.5});
   player_face.setImage(face_anim.next());
   
    
    /* Lantern setup. */
	lanterns.push( new Lantern(jaws.width*3/4, jaws.height*3/2) );
	lanterns.push( new Lantern(2*jaws.width*3/4, jaws.height*3/2) );
	lanterns.push( new Lantern(3*jaws.width*3/4, jaws.height*3/2) );
	// tile_map.push(lanterns);
   
	jaws.on_keydown("esc",  function() { jaws.switchGameState(MenuState) })
    jaws.preventDefaultKeys(["up", "down", "left", "right", "space"])
  }


  this.update = function() {
  	lanterns.update();
    
    if(jaws.pressed("left"))  
    {
    	player.x -= 3; 
    	player.setImage(player.anim_walk_left.next());
    }
    
    else if(jaws.pressed("right")) 
    { 
    	player.x += 3; 
    	player.setImage(player.anim_walk_right.next());
    }
    
    if(jaws.pressed("up"))    
    { 
    	player.y -= 3;
    	player.setImage(player.anim_walk_up.next()); 
    }
    
    else if(jaws.pressed("down"))  
    { 
    	player.y += 3; 
    	player.setImage(player.anim_walk_down.next());
    }
    
    if(jaws.pressed("space")) { 
      if(player.can_fire) {
        bullets.push( new Bullet(player.rect().right, player.y) )
        player.can_fire = false
        setTimeout(function() { player.can_fire = true }, 100)
      }
    }
    
    //check collisions against all lanterns
    if(jaws.collideOneWithMany(player,lanterns).length > 0) {
        player.disease_penalty = 0.01; //while inside, the disease acts slower!
    }
    
    else {
        player.disease_penalty = 0.1; //if not, the disease resumes its course X_X
    }
        
    player.life -= player.disease_penalty;
    
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
    
    
    viewport.centerAround(player);
    forceInsideCanvas(player)
    bullets.removeIf(isOutsideCanvas) // delete items for which isOutsideCanvas(item) is true
    fps.innerHTML = jaws.game_loop.fps
  }


  this.draw = function() {
    jaws.context.clearRect(0,0,jaws.width,jaws.height);
    
    viewport.drawTileMap(tile_map);
    viewport.draw(player);
    
    viewport.apply(function() {
        lanterns.draw();
        });
        
    player_face.draw();
    
    // viewport.draw(lanterns);
    // lanterns.draw();
    // player.draw();
    // bullets.draw();  // will call draw() on all items in the list
    
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


  function Bullet(x, y) 
  {
    this.x = x;
    this.y = y;
    
    this.draw = function() 
    {
      this.x += 4;
      jaws.context.drawImage(jaws.assets.get("./assets/art/bullet.png"), this.x, this.y);
    }
  }
}























