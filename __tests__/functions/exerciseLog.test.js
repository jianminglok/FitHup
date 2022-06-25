import { supabase } from '../../lib/supabase';
import { TESTACC_EMAIL, TESTACC_PASSWORD } from '@env';

async function getUserExercise(email, password) {
    try {

        const signInUser = await supabase.auth.signIn({
            email: email,
            password: password,
        });

        const user = supabase.auth.user();
        
        
        const { data, error } = await supabase
            .from('ActivityLoggerExercise')
            .select()
            .eq("id", user.id)
            .order('date', { ascending: false })
            .order('startTime', { ascending: false })
            .order('endTime', { ascending: false })
        
            if (error) {
                throw error;
            } else if (data) {
                return "User Exercise Data retrieved";
            }

    } catch (error) {
        return error.message;
    }

};

test('Reading exercise log returns User Exercise Data retrieved', () => {
    return getUserExercise(TESTACC_EMAIL, TESTACC_PASSWORD).then(data => {
        expect(data).toBe('User Exercise Data retrieved');
    })
});