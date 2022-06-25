import React from 'react';
import Homepage from '../../components/Homepage'
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

describe('Homepage', () => {
  mockAuthUser.mockReturnValue(mockUser);
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
  const mockDispatchFn = jest.fn()
  useDispatchSpy.mockReturnValue(mockDispatchFn);

  const useSelectorSpy = jest.spyOn(redux, 'useSelector');
  const mockSelectorFn = jest.fn()
  useSelectorSpy.mockReturnValue(mockSelectorFn);

  const homepage = renderer.create(
    <Homepage />
  ).toJSON;

  it('should render successfully', async () => {
    await act(async () => {
      expect(homepage).toBeDefined();
    })
  });

  it('should render correctly', async () => {
    await act(async () => {
      expect(homepage).toMatchSnapshot();
    })
  });

  const { getByTestId } = render(<Homepage />);

  it('should have top bar', () => {
    waitFor(() => {
      const homeTopBar = getByTestId('homeTopBar');
      expect(homeTopBar).toBeInTheDocument();
    })
  });

  it('should have exercises card', () => {
    waitFor(() => {
      const exCard = getByTestId('exCard');
      expect(exCard).toBeInTheDocument();
    })
  });

  it('should have calories card', () => {
    waitFor(() => {
      const calCard = getByTestId('calCard');
      expect(calCard).toBeInTheDocument();
    })
  });

  it('should have recommendations card', () => {
    waitFor(() => {
      const recCard = getByTestId('recCard');
      expect(recCard).toBeInTheDocument();
    })
  });

  useDispatchSpy.mockClear();
  useSelectorSpy.mockClear();
});