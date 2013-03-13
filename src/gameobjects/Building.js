/**
 * A Building represents a static object which can be collided against,
 * but which doesn't move. 
 * @param {Map} properties various properites that affect how the building is instantiated.
 * 	The Building expects the following properties:
 * 		properties.type -> a value between 1 and 6, which designates the type of building
 * 		properties.x -> the x coordinate, anchored by the center
 * 		properties.y -> the y coordinate, anchored by the center
 * 
 */
function Building(properties) {
    
    this.sprite;
    this.colliders = new Array();
    
    //Top-left house
    if(properties.type == 1) {
        this.sprite = new jaws.Sprite({image:"./assets/art/house1_topleft.png", anchor:"center", x:properties.x, y:properties.y});
        center_x = this.sprite.x;
        center_y = this.sprite.y;
        
        //House 1 has two rectangles:
        this.colliders[this.colliders.length] = new RectangularCollider(center_x - 160, center_y - 120, 200, 240);
        this.colliders[this.colliders.length] = new RectangularCollider(center_x - 175, center_y - 110, 275, 150);
    }
    
    //Top-right house
    else if(properties.type == 2) {
        this.sprite = new jaws.Sprite({image:"./assets/art/house2_topright.png", anchor:"center", x:properties.x, y:properties.y});
        center_x = this.sprite.x;
        center_y = this.sprite.y;
        
        //House 2 has two rectangles for the main house, and a small rectangle for a shrub nearby:
        this.colliders[this.colliders.length] = new RectangularCollider(center_x - 110, center_y - 125, 260, 160);
        this.colliders[this.colliders.length] = new RectangularCollider(center_x - 10, center_y - 170, 150, 245);
        this.colliders[this.colliders.length] = new RectangularCollider(center_x - 165, center_y + 75, 20, 20); //shrub
    }
    
    //Bottom-left house
    else if(properties.type == 3) {
        this.sprite = new jaws.Sprite({image:"./assets/art/house3_bottomleft.png", anchor:"center", x:properties.x, y:properties.y});
        center_x = this.sprite.x;
        center_y = this.sprite.y;
        
        //House 3 has two rectangles for the main house, and a small rectangle for a shrub nearby:
        this.colliders[this.colliders.length] = new RectangularCollider(center_x - 140, center_y - 25, 240, 150);
        this.colliders[this.colliders.length] = new RectangularCollider(center_x - 70, center_y - 130, 140, 245);
        this.colliders[this.colliders.length] = new RectangularCollider(center_x + 120, center_y - 80, 20, 20); //shrub
    }
    
    //Bottom-middle house
    else if(properties.type == 4) {
        this.sprite = new jaws.Sprite({image:"./assets/art/house4_bottommiddle.png", anchor:"center", x:properties.x, y:properties.y});
        center_x = this.sprite.x;
        center_y = this.sprite.y;
        
        //House 4 also has two rectangles for the main house, and a small rectangle for a shrub nearby
		this.colliders[this.colliders.length] = new RectangularCollider(center_x - 100, center_y - 15, 280, 160);
        this.colliders[this.colliders.length] = new RectangularCollider(center_x - 20, center_y - 110, 150, 255);
        this.colliders[this.colliders.length] = new RectangularCollider(center_x + 180, center_y - 60, 20, 20); //shrub

    }
    
    //Bottom-right house
    else if(properties.type == 5) {
        this.sprite = new jaws.Sprite({image:"./assets/art/house5_bottomright.png", anchor:"center", x:properties.x, y:properties.y});
        center_x = this.sprite.x;
        center_y = this.sprite.y;
        
		//House 5 also has two rectangles for the main house, and a small rectangle for a shrub nearby
		this.colliders[this.colliders.length] = new RectangularCollider(center_x - 130, center_y - 35, 260, 170);
        this.colliders[this.colliders.length] = new RectangularCollider(center_x - 130, center_y - 80, 150, 265);
        this.colliders[this.colliders.length] = new RectangularCollider(center_x + 125, center_y - 80, 20, 20); //shrub

    }
    
    //Boundary
    else if(properties.type == 6) {
        this.sprite = new jaws.Sprite({image:"./assets/art/gate.png", anchor:"center", x:properties.x, y:properties.y});
    }
    
    this.draw = function() {
        this.sprite.draw();
        
        // DEBUG:
        // for(var index = 0; index < this.colliders.length; index++) {
        	// this.colliders[index].draw();
        // }
    }     
}
