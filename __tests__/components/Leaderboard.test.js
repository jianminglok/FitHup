import React from 'react';
import Leaderboard from '../../components/Leaderboard'
import renderer from 'react-test-renderer';
import { render, waitFor, act } from '@testing-library/react-native';
import { supabase } from '../../lib/supabase';
import * as redux from 'react-redux';

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
    on: jest.fn().mockName('supabse.from().on()').mockReturnThis(),
    subscribe: jest.fn().mockName('supabse.from().on().subscribe()').mockReturnThis(),
    gte: jest.fn().mockName('supabase.from().select().gte()').mockReturnThis(),
    lt: jest.fn().mockName('supabase.from().select().gte().lt()').mockReturnThis(),
    removeSubscription: jest.fn().mockName('supabase.removeSubscription()').mockReturnThis(),
  }
}))

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch
}));

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

describe('Leaderboard', () => {
  mockAuthUser.mockReturnValue(mockUser);
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
  const mockDispatchFn = jest.fn()
  useDispatchSpy.mockReturnValue(mockDispatchFn);

  const useSelectorSpy = jest.spyOn(redux, 'useSelector');
  const mockSelectorFn = jest.fn()
  useSelectorSpy.mockReturnValue(mockSelectorFn);

  const recommendations = renderer.create(
    <Leaderboard />
  ).toJSON;

  it('should render successfully', async () => {
    await act(async () => {
      expect(recommendations).toBeDefined();
    })
  });

  it('should render correctly', async () => {
    await act(async () => {
      expect(recommendations).toMatchSnapshot();
    })
  });

  const { getByTestId } = render(<Leaderboard />);

  it('should have top bar', () => {
    waitFor(() => {
      const leaderboardTopbar = getByTestId('leaderboardTopbar');
      expect(leaderboardTopbar).toBeInTheDocument();
    })
  });

  it('should have title', () => {
    waitFor(() => {
      const title = getByTestId('title');
      expect(title).toBeInTheDocument();
    })
  });

  it('should have recommendations container', () => {
    waitFor(() => {
      const recommendationContainer = getByTestId('recommendationContainer');
      expect(recommendationContainer).toBeInTheDocument();
    })
  });

  useDispatchSpy.mockClear();
  useSelectorSpy.mockClear();
});