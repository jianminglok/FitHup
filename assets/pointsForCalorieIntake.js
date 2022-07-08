const pointsForCalorieIntake = (dict) => {
    for (key in dict) {
        let target = dict[key][1];
        let recommendedAmount = dict[key][2];
        let profilePic = dict[key][3];
        
        let points = 1000;
        let total = dict[key][0];
        let pointsChange = Math.round((recommendedAmount - total) / recommendedAmount * 100 * 10);
        if (target === 'Lose Weight') {
            points += pointsChange;
        } 

        if (target === 'Gain Weight') {
            points -= pointsChange;
        }

        dict[key] = [points, profilePic];

        
    }
    

}


export default pointsForCalorieIntake;