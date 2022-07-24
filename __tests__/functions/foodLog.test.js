import { supabase } from '../../lib/supabase';
import { TESTACC_EMAIL, TESTACC_PASSWORD } from '@env';

async function getUserDietaryIntake(email, password) {
    try {

        const signInUser = await supabase.auth.signIn({
            email: email,
            password: password,
        });

        const user = supabase.auth.user();
        
        const { data, error } = await supabase
            .from('ActivityLoggerCalorie')
            .select()
            .eq("id", user.id)
            .order('date', { ascending: false })
            .order('time', { ascending: false })
        
            if (error) {
                throw error;
            } else if (data) {
                return "User Dietary Intake Data retrieved";
            }

    } catch (error) {
        return error.message;
    }
};

test('Reading food log returns User Dietary Intake Data retrieved', () => {
    return getUserDietaryIntake(TESTACC_EMAIL, TESTACC_PASSWORD).then(data => {
        expect(data).toBe("User Dietary Intake Data retrieved");
    })
});