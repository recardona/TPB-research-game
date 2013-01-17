var max_wander_rotation = 15; //degrees

/**
 * Calculates the two dimensional Euclidian distance between two coordinates.
 * Each coordinate is assumed to be an object with two properties: x and y
 * @param {Object} coordinate_one a two-dimensional coordinate Object with properties x and y
 * @param {Object} coordinate_two a two-dimensional coordinate Object with properties x and y
 */
function euclidian_distance(coordinate_one, coordinate_two) {
    var delta_x = coordinate_two.x - coordinate_one.x;
    var delta_y = coordinate_two.y - coordinate_one.y;
    return Math.sqrt((Math.pow(delta_x,2) + Math.pow(delta_y, 2)));
}

function rotate_point2point(coordinate_one, coordinate_two) {
    var delta_x = coordinate_two.x - coordinate_one.x;
    var delta_y = coordinate_two.y - coordinate_one.y;
    var rotation;
    
    if(delta_x > 0) {
        rotation = (Math.atan((delta_y)/(delta_x)))*180/Math.PI;
    }
    
    else if ((delta_x) == 0) {
        
        if ((delta_y) > 0) {
            rotation = 90;
        }
        
        else {
            rotation = -90;
        }
    }
    
    else {
        rotation = (Math.atan((delta_y)/(delta_x)) + Math.PI)*180/Math.PI;
    }
    
    return rotation;
}



function seek(agent, target_position) {   
    var seek_vector_x = target_position.x - agent.position.x;
    var seek_vector_y = target_position.y - agent.position.y;
    var magnitude     = euclidian_distance(target_position, agent.position);
    var norm_x = seek_vector_x / magnitude;
    var norm_y = seek_vector_y / magnitude;
    var norm_acceleration = {x:norm_x, y:norm_y};
    agent.update(norm_acceleration, 0.1); //update position
    
    
    var degree_of_rotation = rotate_point2point(agent.position, target_position);
    agent.sprite.rotateTo(degree_of_rotation); //update direction
}

