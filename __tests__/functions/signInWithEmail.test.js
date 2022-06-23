import { supabase } from '../../lib/supabase'
import { TESTACC_EMAIL, TESTACC_PASSWORD } from '@env';

async function signInWithEmail(email, password) {
    try {
        const { user, error } = await supabase.auth.signIn({
            email: email,
            password: password,
        });

        if (error) {
            throw error
        } else if (user) {
            return "Successfully logged in";
        }
    } catch (error) {
        return error.message;
    }
};

test('Signing in with correct user details returns Successfully logged in', () => {
    return signInWithEmail(TESTACC_EMAIL, TESTACC_PASSWORD).then(data => {
        expect(data).toBe('Successfully logged in');
    })
});

test('Signing in with correct user details returns Successfully logged in', () => {
    return signInWithEmail('nouser@doesntexist.com', 'password123456').then(data => {
        expect(data).toBe('Invalid login credentials');
    })
});