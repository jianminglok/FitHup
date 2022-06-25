import React from 'react';
import TopBar from '../../components/TopBar';
import renderer from 'react-test-renderer';
import { render, waitFor, act } from '@testing-library/react-native';
import { supabase } from '../../lib/supabase';
import { Provider } from 'react-redux';
import profileReducer from '../../slices/profileSlice'
import { combineReducers, createStore } from 'redux';

function createTestStore() {
  const store = createStore(
    combineReducers({
      profile: profileReducer
    })
  );  
  return store;
}


jest.mock('../../lib/supabase', () => ({
    ...jest.requireActual('../../lib/supabase'),
    __esModule: true,
    supabase: {
        auth: {
            user: jest.fn()
        },
        from: jest.fn().mockName('supabase.from()').mockReturnThis(),
        select: jest.fn().mockName('supabase.from().select()').mockReturnThis(),
        eq: jest.fn().mockName('supabase.from().select().eq()').mockReturnThis(),
        single: jest.fn().mockName('supabase.from().select().single()').mockReturnThis(),
        storage: {
            from: jest.fn().mockName('supabase.storage.from()').mockReturnThis(),
            download: jest.fn().mockName('supabase.storage.from().download()').mockReturnThis(),
        }
    }
}))

const mockUser = {
    app_metadata: {
        provider: "email",
    },
    aud: "authenticated",
    created_at: "2022-03-01T00:00:00.00000Z",
    id: "abc123",
    user_metadata: {},
}

const mockAuthUser = jest.mocked(supabase.auth.user);

describe('Activity Logger (Exercise)', () => {
    mockAuthUser.mockReturnValue(mockUser);
    beforeEach(() => {
        store = createTestStore();
    });

    it('should render successfully', async () => {
        const loggerEx = renderer.create(
            <Provider store={store}>
                <TopBar />
            </Provider>
        ).toJSON;
        await act(async () => {
            expect(loggerEx).toBeDefined();
        })
    });

    it('should render correctly', async () => {
        const loggerEx = renderer.create(
            <Provider store={store}>
                <TopBar />
            </Provider>
        ).toJSON;
        await act(async () => {
            expect(loggerEx).toMatchSnapshot();
        })
    });
});