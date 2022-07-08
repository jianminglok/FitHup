const sortDict = (dict, name) => {

    let ranking;
    let points;
    
    // Create items array
    var items = Object.keys(dict).map(function(key) {
        return [key, dict[key][0], dict[key][1]];
    });
    
    
    // Sort the array based on the second element
    items.sort(function(first, second) {
        return second[1] - first[1];
    });

    //get user personal ranking
    for (let i =0; i< items.length; i++) {
        if (items[i][0] === name) {
            ranking = i + 1;
            points = items[i][1];
        }
    }

    
    return [items, ranking, points];

}




export default sortDict;