import { supabase } from '../lib/supabase'

const pointsForCalorieIntake = async (dict) => {
    // console.log(dict)
    let profilePicDownloaded;

    const getBase64 = async(file) => {
        return new Promise(function(resolve) {
          var reader = new FileReader();
          reader.onloadend = function() {
            resolve(reader.result)
          }
          reader.readAsDataURL(file);
        })
      };
    
    

    const downloadImage = async (path) => {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path)
            if (error) {
                throw error
            }
            if (data) {
                profilePicDownloaded = await getBase64(data);
            
            }
        } catch (error) {
            console.log(error)
        }
    }

    
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

        await downloadImage(profilePic)

        dict[key] = [points, profilePicDownloaded];
    }
    

}


export default pointsForCalorieIntake;