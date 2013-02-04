
function Player(x,y) {
    
    var player_horiz_anim = new jaws.Animation({sprite_sheet: "./assets/art/player_LR_spritesheet.png", frame_size:[57.571,84], loop:true});
    var player_vert_anim  = new jaws.Animation({sprite_sheet: "./assets/art/player_UD_spritesheet.png", frame_size:[74.714,54], loop:true});
    
    //Sprite and collision attributes
    this.sprite = new jaws.Sprite({x: x, y: y, anchor:"center", scale: 0.75});
    this.anim_walk_left  = player_horiz_anim.slice(0,7);
    this.anim_walk_right = player_horiz_anim.slice(7,14);
    this.anim_walk_down  = player_vert_anim.slice(0,7);
    this.anim_walk_up    = player_vert_anim.slice(7,14);
    this.sprite.setImage(this.anim_walk_right.next());
    
    
    this.radius = 20; //px - this radius is made available for circle-based collision
    
    //Game logic attributes
    this.life   = 100;
    this.disease_penalty = 0.1;
    
    this.draw = function() {
        this.sprite.draw();
    }
    
    this.rect = function() {
        return this.sprite.rect();
    }    
}
