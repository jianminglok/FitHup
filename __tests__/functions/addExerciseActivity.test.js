import { supabase } from '../../lib/supabase'
import { TESTACC_EMAIL, TESTACC_PASSWORD, CALORIE_APININJA } from '@env';
import "isomorphic-fetch"

import { values, exercises } from '../../assets/activities';

const computeCal = (weight, duration, value) => {
    value = Math.floor(value);
    //duration in minutes
    duration = Math.floor(duration);
    //get weight in kg and convert to pounds
    weight = Math.floor(weight * 2.20462);
    const tmpCalories = value.toFixed(2);
    const tmpTotal = Math.abs(tmpCalories * (weight / 2.2) * (duration / 60)).toFixed(0);
    return tmpTotal;
};

async function addActivity(exerciseType, weight, caloriesAmount) {
    let success = false;
    try {
        const { user } = await supabase.auth.signIn({
            email: TESTACC_EMAIL,
            password: TESTACC_PASSWORD,
        });
        if (!user) throw new Error("No user on the session!");

        //calculate duration in minutes
        let duration = 50;
        let exerciseNumber = values[exerciseType];
        let recommendedCalories = computeCal(weight, duration, exerciseNumber);

        if (!exerciseType) {
            throw new Error("Please enter the type of exercise!")
        }

        if (!caloriesAmount) {
            throw new Error("Please enter the calories amount!")
        }

        if (caloriesAmount > 1.25 * recommendedCalories) {
            throw new Error("The value of calories is too high")
        }

        const updates = {
            id: user.id,
            listValue: 0,
            exerciseType,
            date: new Date().toISOString(),
            startTime: '12:34',
            endTime: '13:45',
            caloriesAmount: parseInt(caloriesAmount)
        };

        const { data, error } = await supabase
            .from('ActivityLoggerExercise')
            .upsert(updates);

        //console.log(data)
        //console.log(error)

        if (data) {
           return 'Exercise activity successfully added'
        }

        if (error) {
            throw error;
        }
    } catch (error) {
        return (error).message
    }
}

let exerciseType = 'Baseball';
let weight = 50;
let caloriesAmount = 100;

test('Exercise type not entered', () => {
    return addActivity(null, weight, caloriesAmount).then(data => {
        expect(data).toBe('Please enter the type of exercise!');
    })
});

test('Calories amount not entered', () => {
    return addActivity(exerciseType, weight, null).then(data => {
        expect(data).toBe('Please enter the calories amount!');
    })
});

test('All required fields entered', () => {
    return addActivity(exerciseType, weight, caloriesAmount).then(data => {
        expect(data).toBe('Exercise activity successfully added');
    })
});
