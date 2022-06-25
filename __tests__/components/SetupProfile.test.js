import React from 'react';
import SetupProfile from '../../components/SetupProfile';
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

describe('Activity Logger (Calorie)', () => {
  mockAuthUser.mockReturnValue(mockUser);
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
  const mockDispatchFn = jest.fn()
  useDispatchSpy.mockReturnValue(mockDispatchFn);

  const useSelectorSpy = jest.spyOn(redux, 'useSelector');
  const mockSelectorFn = jest.fn()
  useSelectorSpy.mockReturnValue(mockSelectorFn);

  const loggerEx = renderer.create(
    <SetupProfile />
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

  const { getByTestId } = render(<SetupProfile />);

  it('should have name field', () => {
    waitFor(() => {
      const nameField = getByTestId('nameField');
      expect(nameField).toBeInTheDocument();
    })
  });

  it('should have date of birth field', () => {
    waitFor(() => {
      const dateField = getByTestId('dateField');
      expect(dateField).toBeInTheDocument();
    })
  });

  it('should have gender field', () => {
    waitFor(() => {
      const genderField = getByTestId('genderField');
      expect(genderField).toBeInTheDocument();
    })
  });

  it('should have height field', () => {
    waitFor(() => {
      const heightField = getByTestId('heightField');
      expect(heightField).toBeInTheDocument();
    })
  });

  it('should have weight field', () => {
    waitFor(() => {
      const weightField = getByTestId('weightField');
      expect(weightField).toBeInTheDocument();
    })
  });

  it('should have lifestyle type field', () => {
    waitFor(() => {
      const lifestyleType = getByTestId('lifestyleType');
      expect(lifestyleType).toBeInTheDocument();
    })
  });
  
  it('should have save/edit profile button', () => {
    waitFor(() => {
      const saveProfileBtn = getByTestId('saveProfileBtn');
      expect(saveProfileBtn).toBeInTheDocument();
    })
  });

  useDispatchSpy.mockClear();
  useSelectorSpy.mockClear();
});