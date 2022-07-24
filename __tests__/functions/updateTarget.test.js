import { supabase } from '../../lib/supabase'
import { TESTACC_EMAIL, TESTACC_PASSWORD, CALORIE_APININJA } from '@env';
import "isomorphic-fetch"

import { values, exercises } from '../../assets/activities';

let targetType = 'Lose Weight'
let gender = 'Male'
let weight = 65;
let height = 170;
let dateOfBirth = '2000-01-02'
let lifestyleType = 'Sedentary'
let targetWeight = '(Mild) 0.25kg per week'
let caloriesBurntAmount

function calculateAge(birthDate, otherDate) {
    birthDate = new Date(birthDate);
    otherDate = new Date(otherDate);

    var years = (otherDate.getFullYear() - birthDate.getFullYear());

    if (otherDate.getMonth() < birthDate.getMonth() ||
        otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
        years--;
    }

    return years;
}

const computeCalIntake = (height, weight, dateOfBirth, targetType, targetWeight) => {
    //Calculate BMR according to gender
    let BMR, TDEE;
    if (gender == 'Male') {
        BMR = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * calculateAge(new Date(dateOfBirth), new Date());
    } else if (gender == 'Female') {
        BMR = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * calculateAge(new Date(dateOfBirth), new Date());
    }

    //Calculate TDEE according to lifestyleType
    if (lifestyleType == 'Sedentary') {
        TDEE = BMR * 1.2;
    } else if (lifestyleType == 'Lightly Active') {
        TDEE = BMR * 1.375;
    } else if (lifestyleType == 'Moderately Active') {
        TDEE = BMR * 1.55;
    } else if (lifestyleType == 'Very Active') {
        TDEE = BMR * 1.725;
    } else if (lifestyleType == 'Extra Active') {
        TDEE = BMR * 1.9;
    }

    //Calculate final TDEE based on target type
    if (targetType == "Gain Weight") {
        if (targetWeight == "(Moderate) 0.5kg per week") {
            TDEE += 500;
        } else if (targetWeight == "(Mild) 0.25kg per week") {
            TDEE += 250;
        } else if (targetWeight == "(Extreme) 1.0kg per week") {
            TDEE += 1000;
        }
    } else if (targetType == "Lose Weight") {
        if (targetWeight == "(Moderate) 0.5kg per week") {
            TDEE -= 500;
        } else if (targetWeight == "(Mild) 0.25kg per week") {
            TDEE -= 250;
        } else if (targetWeight == "(Extreme) 1.0kg per week") {
            TDEE -= 1000;
        }
    }

    recommendedCaloriesIntake = (Math.round(TDEE));
};

async function updateTarget(targetType, caloriesIntakeAmount) {
    let success = false;
    try {
        const { user } = await supabase.auth.signIn({
            email: TESTACC_EMAIL,
            password: TESTACC_PASSWORD,
        });
        if (!user) throw new Error("No user on the session!");

        if (!targetType) {
            throw new Error("Please enter the type of target!")
        }

        if (!caloriesIntakeAmount) {
            throw new Error("Please enter the calories intake amount!")
        }

        if (parseInt(caloriesIntakeAmount) < 1500) {
            throw new Error("The value of calories intake is too low and is not recommended")
        }

        if (parseInt(caloriesIntakeAmount) > 1.25 * recommendedCaloriesIntake) {
            throw new Error("The value of calories intake is too high")
        }

        const updates = {
            id: user.id,
            targetType,
            targetWeight,
            caloriesIntakeAmount: parseInt(caloriesIntakeAmount),
            caloriesBurntAmount: parseInt(caloriesBurntAmount),
            recommendedCaloriesIntakeAmount: recommendedCaloriesIntake
        };

        const { data, error } = await supabase
            .from('target')
            .upsert(updates);

        if (data) {
            return 'Target successfully set!'
        }

        if (error) {
            throw error;
        }
    } catch (error) {
        return (error).message
    }
}

computeCalIntake(height, weight, dateOfBirth, 'Lose Weight', targetWeight);

test('Target type not entered', () => {
    return updateTarget(null, 1500).then(data => {
        expect(data).toBe('Please enter the type of target!');
    })
});

test('Calorie amount not entered', () => {
    return updateTarget(targetType, null).then(data => {
        expect(data).toBe('Please enter the calories intake amount!');
    })
});

test('Calorie amount entered is too low', () => {
    return updateTarget(targetType, 1234).then(data => {
        expect(data).toBe('The value of calories intake is too low and is not recommended');
    })
});

test('Calorie amount entered is too high', () => {
    return updateTarget(targetType, 12345).then(data => {
        expect(data).toBe('The value of calories intake is too high');
    })
});

test('All fields entered correctly', () => {
    return updateTarget(targetType, 1789).then(data => {
        expect(data).toBe('Target successfully set!');
    })
});
