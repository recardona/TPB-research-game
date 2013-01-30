
function Building(properties) {
    
    this.sprite;
    
    //Building
    if(properties.type == 1) {
        this.sprite = new jaws.Sprite({image:"./assets/art/building_1.png", anchor:"center", x:properties.x, y:properties.y});
    }
    
    //Cabin
    else if(properties.type == 2) {
        this.sprite = new jaws.Sprite({image:"./assets/art/cabin_1.png", anchor:"center", x:properties.x, y:properties.y});
    }
    
    //Hut
    else if(properties.type == 3) {
        this.sprite = new jaws.Sprite({image:"./assets/art/hut_1.png", anchor:"center", x:properties.x, y:properties.y});
    }
    
    //Shop
    else if(properties.type == 4) {
        this.sprite = new jaws.Sprite({image:"./assets/art/shop_1.png", anchor:"center", x:properties.x, y:properties.y});
    }
    
    this.rect = function() {
        return this.sprite.rect();
    }
    
    this.draw = function() {
        this.sprite.draw();
    }
    
}
