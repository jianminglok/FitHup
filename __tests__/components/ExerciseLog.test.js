import React from 'react';
import Exercise from '../../components/ExerciseLog';
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
    on: jest.fn().mockName('supabase.from().on()').mockReturnThis(),
    subscribe: jest.fn().mockName('supabase.from().on().subscribe()').mockReturnThis(),
    select: jest.fn().mockName('supabase.from().select()').mockReturnThis(),
    eq: jest.fn().mockName('supabase.from().select().eq()').mockReturnThis(),
    single: jest.fn().mockName('supabase.from().select().single()').mockReturnThis(),
    order: jest.fn().mockName('supabase.from().select().order()').mockReturnThis(),
    order: jest.fn().mockName('supabase.from().select().order().order()').mockReturnThis(),
    order: jest.fn().mockName('supabase.from().select().order().order().order()').mockReturnThis(),
    removeSubscription: jest.fn()
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

describe('Exercise Log', () => {
  mockAuthUser.mockReturnValue(mockUser);
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
  const mockDispatchFn = jest.fn()
  useDispatchSpy.mockReturnValue(mockDispatchFn);

  const useSelectorSpy = jest.spyOn(redux, 'useSelector');
  const mockSelectorFn = jest.fn()
  useSelectorSpy.mockReturnValue(mockSelectorFn);

  const loggerEx = renderer.create(
    <Exercise />
  ).toJSON;

  it('should render successfully', async () => {
    await act(async () => {
      expect(loggerEx).toBeDefined();
    })
  });

  it('should render correctly', async () => {
    await act(async () => {
      expect(loggerEx).toMatchSnapshot();
    })
  });

  const { getByTestId } = render(<Exercise />);

  it('should have top bar', () => {
    waitFor(() => {
      const logTopBar = getByTestId('logTopBar');
      expect(logTopBar).toBeInTheDocument();
    })
  });

  it('should have title', () => {
    waitFor(() => {
      const title = getByTestId('title');
      expect(title).toBeInTheDocument();
    })
  });

  it('should have exercise log container', () => {
    waitFor(() => {
      const logContainer = getByTestId('logContainer');
      expect(logContainer).toBeInTheDocument();
    })
  });

  useDispatchSpy.mockClear();
  useSelectorSpy.mockClear();
});