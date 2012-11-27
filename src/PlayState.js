/*
 *
 * PlayState is the actual game play. We switch to it once user choses "Start game"
 *
 */
function PlayState() {
  var player
  var bullets = new jaws.SpriteList()

  this.setup = function() {
    player = new jaws.Sprite({image: "./assets/art/plane.png", x: 10, y:100})
    player.can_fire = true
    jaws.on_keydown("esc",  function() { jaws.switchGameState(MenuState) })
    jaws.preventDefaultKeys(["up", "down", "left", "right", "space"])
  }

  this.update = function() {
    if(jaws.pressed("left"))  { player.x -= 2 }
    if(jaws.pressed("right")) { player.x += 2 }
    if(jaws.pressed("up"))    { player.y -= 2 }
    if(jaws.pressed("down"))  { player.y += 2 }
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
    jaws.context.clearRect(0,0,jaws.width,jaws.height)
    player.draw()
    bullets.draw()  // will call draw() on all items in the list
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

  function Bullet(x, y) {
    this.x = x
    this.y = y
    this.draw = function() {
      this.x += 4
      jaws.context.drawImage(jaws.assets.get("./assets/art/bullet.png"), this.x, this.y)
    }
  }
}
