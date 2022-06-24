import { supabase } from '../../lib/supabase'
import { TESTACC_EMAIL, TESTACC_PASSWORD, CALORIE_APININJA } from '@env';
import "isomorphic-fetch"

async function addActivity(foodType, portionValue, unit) {
    let success = false;
    try {
        const { user } = await supabase.auth.signIn({
            email: TESTACC_EMAIL,
            password: TESTACC_PASSWORD,
        });
        if (!user) throw new Error("No user on the session!");

        if (!foodType) {
            throw new Error("Please enter the type of food!")
        } else if (!portionValue) {
            throw new Error("Please enter the portion value!")
        } else if (!unit) {
            throw new Error("Please enter the unit value!")
        }

        const response = await fetch(
            'https://api.api-ninjas.com/v1/nutrition?query=' + portionValue + unit + ' ' + foodType, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': CALORIE_APININJA
            },
        }
        );

        const json = await response.json();

        if (!json) {
            throw new Error("Error determining amount of calories!")
        }

        const updates = {
            id: user.id,
            listValue: 0,
            foodType : foodType.charAt(0).toUpperCase() + foodType.toLowerCase().slice(1),
            date: new Date().toISOString(),
            time: '12:34',
            caloriesAmount: json[0]['calories'],
            portionValue,
            unit,
        };

        const { data, error } = await supabase
            .from('ActivityLoggerCalorie')
            .upsert(updates);

        if (data) {
            return('Dietary activity successfully added')
        }

        if (error) {
            throw error;
        }
    } catch (error) {
        return((error).message);
    } finally {
        //setLoading(false);
        if (success) {
            navigation.push("TabStack");
        }
    }
}

let foodType, portionValue, unit = null

test('Food type not entered', () => {
    return addActivity(null, portionValue, unit).then(data => {
        expect(data).toBe('Please enter the type of food!');
    })
});

foodType = 'rice';

test('Portion value not entered', () => {
    return addActivity(foodType, null, unit).then(data => {
        expect(data).toBe('Please enter the portion value!');
    })
});

portionValue = '100'

test('Unit value not entered', () => {
    return addActivity(foodType, portionValue, null).then(data => {
        expect(data).toBe('Please enter the unit value!');
    })
});

unit = 'grams'

test('All required fields entered', () => {
    return addActivity(foodType, portionValue, unit).then(data => {
        expect(data).toBe('Dietary activity successfully added');
    })
});