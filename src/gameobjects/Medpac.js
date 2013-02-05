/**
 * A Medpac is an object which boosts a player's medicine life.
 * A player's life can never be healed, however, the player has a
 * secondary life that acts as a sort of substitute life.  Think
 * of it as an armor that is replenished with the Medpac.
 */

function Medpac(x,y) {
    
    this.x = x;
    this.y = y;
    this.radius = 16; //radius field for collision
    
    this.sprite = new jaws.Sprite({image: "./assets/art/medpac.png", anchor:"center", x:x, y:y});
    
    this.draw = function() {
        this.sprite.draw();
    }
    
    this.rect = function() {
        return this.sprite.rect();
    }
}
