import { supabase } from '../lib/supabase'

const pointsForCalorieIntake = async (dict) => {
    let profilePicDownloaded;

    const downloadImage = async (path, index) => {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path)
            if (error) {
                throw error
            }

            const fileReaderInstance = new FileReader();
            fileReaderInstance.readAsDataURL(data);
            fileReaderInstance.onload = () => {
                let base64data = fileReaderInstance.result;
                profilePicDownloaded = base64data;
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