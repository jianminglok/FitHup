import { supabase } from '../../lib/supabase'
import { TESTACC_EMAIL, TESTACC_PASSWORD, CALORIE_APININJA } from '@env';
import "isomorphic-fetch"

async function updateProfile(weight) {
    try {
        const { user } = await supabase.auth.signIn({
            email: TESTACC_EMAIL,
            password: TESTACC_PASSWORD,
        });
        if (!user) throw new Error("No user on the session!");

        if (!weight) {
            throw new Error('Weight is required!')
        }

        let name = 'User';
        let gender = 'male';
        let height = 123;
        let lifestyleType = 'active';

        const updates = {
            id: user.id,
            name,
            dateOfBirth: new Date().toISOString(),
            gender,
            height: parseFloat(height),
            weight: parseFloat(weight),
            lifestyleType: lifestyleType,
            profileSetup: true
        };

        const { data, error } = await supabase
            .from('profiles')
            .upsert(updates, { onConflict: 'id' })

        if (data) {
            return 'Profile successfully updated'
        }

        if (error) {
            throw error;
        }
    } catch (error) {
        if ((error).message.includes("username_length")) {
            return 'Name has to be at least 3 characters';
        } else {
            return (error).message;
        }
    }
}

test('Weight not entered', () => {
    return updateProfile(null).then(data => {
        expect(data).toBe('Weight is required!');
    })
});

let weight = 50;

test('All required fields entered', () => {
    return updateProfile(weight).then(data => {
        expect(data).toBe('Profile successfully updated');
    })
});
