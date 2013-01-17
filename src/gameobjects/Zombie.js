/**
 * Zombies are generated randomly on the map and they will wander aimlessly
 * until they are either too far from the player (in which case they are removed)
 * or too close, in which case they chase the player in a dumb fashion.
 */
function Zombie(x,y) {
     
    var max_velocity_magnitude = 10;
    var player_horiz_anim = new jaws.Animation({sprite_sheet: "./assets/art/player_LR_spritesheet_zombies.png", frame_size:[57.571,84], loop:true})
    var player_vert_anim = new jaws.Animation({sprite_sheet: "./assets/art/player_UD_spritesheet_zombies.png", frame_size:[74.714,54], loop:true});
    
    this.sprite = new jaws.Sprite({x: x, y: y, anchor:"center", scale: 0.75});
    
    this.sprite.anim_walk_left  = player_horiz_anim.slice(0,7);
    this.sprite.anim_walk_right = player_horiz_anim.slice(7,14);
    this.sprite.anim_walk_down  = player_vert_anim.slice(0,7);
    this.sprite.anim_walk_up    = player_vert_anim.slice(7,14);
    this.sprite.setImage(this.sprite.anim_walk_right.next());
    
    // These fields are set as a convenience; several functions
    // (jaws functions included) operate at the first level of
    // a JS-object, and as such, the functions will look at this
    // level for the properties of interest
    
    this.position = {x:this.sprite.x, y:this.sprite.y};
    this.velocity = {x:0, y:0};
    this.lastVelocity = {x:0, y:0};
    this.lastAcceleration = {x:0, y:0};
    this.rect = this.sprite.rect();
    
    this.updateVelocity = function(acceleration,dt) {
        
        //If no external force is applied,
        if(acceleration.x == 0 && acceleration.y == 0) {

            //if NPC:            
            //the negative sign (-1) is meant to act as deceleration 
            this.velocity.x = this.velocity.x + (this.lastAcceleration.x * dt * -1 * max_velocity_magnitude);
            this.velocity.y = this.velocity.y + (this.lastAcceleration.y * dt * -1 * max_velocity_magnitude);
            
            //if the velocity changes sign to match that of the lastAcceleration, stop
            if(  (this.velocity.x > 0) == (this.lastAcceleration.x > 0)  ) {
                this.velocity.x = 0;
                this.lastAcceleration.x = 0;
            }
            
            if((this.velocity.y > 0) == (this.lastAcceleration.y > 0)) {
                this.velocity.y = 0;
                this.lastAcceleration.y = 0;
            }
                        
        }
        
        else {
            this.velocity.x = (acceleration.x * dt * max_velocity_magnitude * 10);
            this.velocity.y = (acceleration.y * dt * max_velocity_magnitude * 10);
            this.lastAcceleration.x = acceleration.x;
            this.lastAcceleration.y = acceleration.y;
        }
    }
    
    this.updatePosition = function(dt) {

        //if I can move,
        this.sprite.move(this.velocity.x * dt, this.velocity.y * dt);
        
        //This is to ensure that the convenience properties are not stale
        this.position.x = this.sprite.x;
        this.position.y = this.sprite.y;        
    }
        
    
    this.update = function(acceleration,dt) {
        this.updateVelocity(acceleration,dt);
        this.updatePosition(dt);
        this.sprite.setImage(this.sprite.anim_walk_right.next());
    }
    
    
    /**
     * Returns a number representing the quadrant a coordinate is in, given
     * its x and y coordinates.
     * @param {Number} x_coordinate
     * @param {Number} y_coordinate
     */  
    function quadrant(x_coordinate, y_coordinate) {
        
        if(x_coordinate > 0 && y_coordinate > 0) {
            return 1;
        }
        
        else if(x_coordinate < 0 && y_coordinate > 0) {
            return 2;
        }
        
        else if(x_coordinate < 0 && y_coordinate < 0) {
            return 3;
        }
        
        else {
            return 4;
        }
        
    }
    
    this.draw = function() {
        this.sprite.draw();
    }
    
}
