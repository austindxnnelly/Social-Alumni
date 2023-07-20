
/**
 * Caculates what level the user belongs to based off of the number of points they current have.
 * @param {*} points 
 * @returns The string of the "level" the user belongs to 
 */
function reassign(points) {
    if(points >= 5 && points < 20){
        return "Bronze";
    }else if(points >= 20 && points < 50){
        return "Sliver";
    }else if(points >= 50 && points < 75){
        return "Gold";
    }else if(points > 75){
        return "Platinum";
    }
    return "New";
}

module.exports = { reassign };