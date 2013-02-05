
function Player(x,y) {
    
    var player_horiz_anim = new jaws.Animation({sprite_sheet: "./assets/art/player_spritesheet_leftright.png", frame_size:[128,128], loop:true});
    var player_vert_anim  = new jaws.Animation({sprite_sheet: "./assets/art/player_spritesheet_updown.png", frame_size:[128,128], loop:true});
    
    //Sprite and collision attributes
    this.sprite = new jaws.Sprite({x: x, y: y, anchor:"center", scale: 0.75});
    this.anim_walk_left  = player_horiz_anim.slice(0,8);
    this.anim_walk_right = player_horiz_anim.slice(8,16);
    this.anim_walk_down  = player_vert_anim.slice(0,8);
    this.anim_walk_up    = player_vert_anim.slice(8,16);
    this.sprite.setImage(this.anim_walk_right.next());
    this.radius = 16; //px - this radius is made available for circle-based collision
    this.facingHorizontally = true;
    
    //Game logic attributes
    this.life   = 100;
    this.disease_penalty = 0.1;
    
    
    this.draw = function() {
        this.sprite.draw();
        // this.sprite.rect().move(32,32).resizeTo(32,32).draw(); //DO NOT DELETE: Useful for debugging
    }
    
    this.rect = function() {
        return this.sprite.rect().move(32,32).resizeTo(32,32);
    }    
}
