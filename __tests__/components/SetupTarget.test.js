import React from 'react';
import SetupTarget from '../../components/SetupTarget'
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

describe('SetupTarget', () => {
  mockAuthUser.mockReturnValue(mockUser);
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
  const mockDispatchFn = jest.fn()
  useDispatchSpy.mockReturnValue(mockDispatchFn);

  const useSelectorSpy = jest.spyOn(redux, 'useSelector');
  const mockSelectorFn = jest.fn()
  useSelectorSpy.mockReturnValue(mockSelectorFn);

  const setupTarget = renderer.create(
    <SetupTarget />
  ).toJSON;

  it('should render successfully', async () => {
    await act(async () => {
      expect(setupTarget).toBeDefined();
    })
  });

  it('should render correctly', async () => {
    await act(async () => {
      expect(setupTarget).toMatchSnapshot();
    })
  });

  const { getByTestId } = render(<SetupTarget />);

  it('should have top bar', () => {
    waitFor(() => {
      const setupTargetTopbar = getByTestId('setupTargetTopbar');
      expect(setupTargetTopbar).toBeInTheDocument();
    })
  });

  it('should have title', () => {
    waitFor(() => {
      const title = getByTestId('title');
      expect(title).toBeInTheDocument();
    })
  });

  it('should have target type field', () => {
    waitFor(() => {
      const targetType = getByTestId('targetType');
      expect(targetType).toBeInTheDocument();
    })
  });

  useDispatchSpy.mockClear();
  useSelectorSpy.mockClear();
});