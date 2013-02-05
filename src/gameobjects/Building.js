
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
    
    //Market
    else if(properties.type == 5) {
        this.sprite = new jaws.Sprite({image:"./assets/art/market_blueRed.png", anchor:"center", x:properties.x, y:properties.y});
    }
    
    this.draw = function() {
        this.sprite.draw();
    }
    
    this.rect = function() {
        return this.sprite.rect();
    }
    
    
}
