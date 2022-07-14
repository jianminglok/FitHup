import { supabase } from '../lib/supabase'

const sortDict = async (dict, userId) => {
    let profilePicDownloaded;

    let ranking = 0;
    let points = 0;

    const getBase64 = async (file) => {
        return new Promise(function (resolve) {
            var reader = new FileReader();
            reader.onloadend = function () {
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

    // Create items array
    var items = Object.keys(dict).map(function (key) {
        return [key, dict[key][0], dict[key][1], dict[key][2]];
    });

    // Sort the array based on the second element
    items.sort(function (first, second) {
        return second[1] - first[1];
    });

    //get user personal ranking
    for (let i = 0; i < items.length; i++) {
        await downloadImage(items[i][2])
        items[i][2] = profilePicDownloaded
        if (items[i][0] === userId) {
            ranking = i + 1;
            points = items[i][1];
        }
    }

    return [items, ranking, points];
}

export default sortDict;