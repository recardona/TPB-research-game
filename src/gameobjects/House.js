
function House(properties) {
    
    this.sprite;
    
    //Top-left house
    if(properties.type == 1) {
        this.sprite = new jaws.Sprite({image:"./assets/art/house1_topleft.png", anchor:"center", x:properties.x, y:properties.y});
    }
    
    //Top-right house
    else if(properties.type == 2) {
        this.sprite = new jaws.Sprite({image:"./assets/art/house2_topright.png", anchor:"center", x:properties.x, y:properties.y});
    }
    
    //Bottom-left house
    else if(properties.type == 3) {
        this.sprite = new jaws.Sprite({image:"./assets/art/house3_bottomleft.png", anchor:"center", x:properties.x, y:properties.y});
    }
    
    //Bottom-middle house
    else if(properties.type == 4) {
        this.sprite = new jaws.Sprite({image:"./assets/art/house4_bottommiddle.png", anchor:"center", x:properties.x, y:properties.y});
    }
    
    //Bottom-right house
    else if(properties.type == 5) {
        this.sprite = new jaws.Sprite({image:"./assets/art/house5_bottomright.png", anchor:"center", x:properties.x, y:properties.y});
    }
    
    //Boundary
    else if(properties.type == 6) {
        this.sprite = new jaws.Sprite({image:"./assets/art/gate.png", anchor:"center", x:properties.x, y:properties.y});
    }
    
    this.draw = function() {
        this.sprite.draw();
    }
    
    this.rect = function() {
        return this.sprite.rect();
    }
    
    
}
