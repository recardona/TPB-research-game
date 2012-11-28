/*
 *
 * PlayState is the actual game play. We switch to it once user choses "Start game"
 *
 */
function PlayState() {
  var player;
  var bullets = new jaws.SpriteList();
  var lanterns = new jaws.SpriteList();
  var background;

  this.setup = function() {
  	
  	/* Background setup. */
  	background = new jaws.Sprite({image:"./assets/art/background_1024.png", anchor:"top_left", x:0, y:0});
  	
  	
  	/* Player setup. */
  	var player_horiz_anim = new jaws.Animation({sprite_sheet: "./assets/art/player_LR_spritesheet.png", frame_size:[57.571,84], loop:true});
  	var player_vert_anim = new jaws.Animation({sprite_sheet: "./assets/art/player_UD_spritesheet.png", frame_size:[74.714,54], loop:true});
   	
    player = new jaws.Sprite({x: 10, y:100, anchor:"center"});
    player.can_fire = true;
    player.anim_walk_left  = player_horiz_anim.slice(0,7);
    player.anim_walk_right = player_horiz_anim.slice(7,14);
    player.anim_walk_down  = player_vert_anim.slice(0,7);
    player.anim_walk_up    = player_vert_anim.slice(7,14);
    player.setImage(player.anim_walk_right.next());
    
    
    /* Lantern setup. */
	lanterns.push( new Lantern(jaws.width/4, jaws.height/2) );
	lanterns.push( new Lantern(2*jaws.width/4, jaws.height/2) );
	lanterns.push( new Lantern(3*jaws.width/4, jaws.height/2) );
   
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

    forceInsideCanvas(player)
    bullets.removeIf(isOutsideCanvas) // delete items for which isOutsideCanvas(item) is true
    fps.innerHTML = jaws.game_loop.fps
  }

  this.draw = function() {
    jaws.context.clearRect(0,0,jaws.width,jaws.height);
    background.draw();
    lanterns.draw();
    player.draw();
    bullets.draw();  // will call draw() on all items in the list
  }

  /* Simular to example1 but now we're using jaws properties to get width and height of canvas instead */
  /* This mainly since we let jaws handle the canvas now */
  function isOutsideCanvas(item) { 
    return (item.x < 0 || item.y < 0 || item.x > jaws.width || item.y > jaws.height) 
  }
  function forceInsideCanvas(item) {
    if(item.x < 0)                  { item.x = 0  }
    if(item.x + item.width > jaws.width)     { item.x = jaws.width - item.width }
    if(item.y < 0)                  { item.y = 0 }
    if(item.y + item.height  > jaws.height)  { item.y = jaws.height - item.height }
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
  
  function Lantern(x,y)
  {
  	this.ring    = new jaws.Sprite({image: "./assets/art/safety_ring.png", anchor:"center", x:x, y:y});
  	this.lantern = new jaws.Sprite({image: "./assets/art/lantern.png", anchor:"center", x:x, y:y});
  	
  	// background = new jaws.Sprite({image:"./assets/art/background_1024.png", anchor:"top_left", x:0, y:0});
  	this.update = function()
  	{
  		this.ring.rotate(1); //degrees
  	}
  	
  	this.draw = function()
  	{
  		this.lantern.draw();
  		this.ring.draw();
  	}
  }
}























