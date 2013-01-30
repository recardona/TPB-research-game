var max_wander_rotation = 15; //degrees

/**
 * Returns a number between -1 and 1.  Numbers closer to zero are more likely.
 */
function random_sigmoid() {
    return (Math.random() - Math.random());
}

/**
 * Rotates the vector given by the coordinate and the origin, by
 * the angle_in_degrees, in a counterclockwise fashion with respect
 * to the x-axis.
 */
function rotate_vector_counterclockwise(coordinate, angle_in_degrees) {
    var sin_of_angle = Math.sin(angle_in_degrees);
    var cos_of_angle = Math.cos(angle_in_degrees);
    
    var new_x = ( coordinate.x * cos_of_angle) + (coordinate.y * sin_of_angle); 
    var new_y = (-coordinate.x * sin_of_angle) + (coordinate.y * cos_of_angle);
    
    return {x:new_x, y:new_y};    
}

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

/**
 * Returns the degrees between two vectors defined by two points
 * in Euclidian 2D space.
 * @param {Object} coordinate_one
 * @param {Object} coordinate_two
 */
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


/**
 * FIXME: Wander agent
 * @param {Object} agent
 */
function wander(agent) {
    
    //if the agent is stationary,
    if(agent.velocity.x == 0 && agent.velocity.y == 0) {
        var rand_x_acceleration = random_sigmoid();
        var rand_y_acceleration = random_sigmoid();
        var rand_acceleration = {x:rand_x_acceleration, y:rand_y_acceleration};
        agent.update(rand_acceleration, 0.1); //move in a random direction
        
        var degree_of_rotation = rotate_point2point(agent.position, {x:rand_x_acceleration, y:rand_y_acceleration});
        agent.sprite.rotateTo(degree_of_rotation);
    }
    
    else {
        var sigmoid = random_sigmoid();
        var rotation_degrees = max_wander_rotation * sigmoid;
        var wander_direction = rotate_vector_counterclockwise(agent.velocity, rotation_degrees);
        var wander_direction_magnitude = euclidian_distance(agent.position, wander_direction);
        var wander_direction_norm_x = wander_direction.x / wander_direction_magnitude; 
        var wander_direction_norm_y = wander_direction.y / wander_direction_magnitude;
        var normalized_wander_direction = {x:wander_direction_norm_x, y:wander_direction_norm_y};
        agent.update(normalized_wander_direction, 0.1);
        
        var degree_of_rotation = rotate_point2point(agent.position, wander_direction);
        agent.sprite.rotateTo(degree_of_rotation);

    }
    
}










