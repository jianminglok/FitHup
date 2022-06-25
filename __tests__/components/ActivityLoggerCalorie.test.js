import React from 'react';
import ActivityLoggerCalorie from '../../components/ActivityLoggerCalorie';
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
    <ActivityLoggerCalorie />
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

  const { getByTestId } = render(<ActivityLoggerCalorie />);

  it('should have top bar', () => {
    waitFor(() => {
      const homeTopBar = getByTestId('homeTopBar');
      expect(homeTopBar).toBeInTheDocument();
    })
  });

  it('should have activity type field', () => {
    waitFor(() => {
      const activityField = getByTestId('activityField');
      expect(activityField).toBeInTheDocument();
    })
  });

  it('should have food type field', () => {
    waitFor(() => {
      const foodField = getByTestId('foodField');
      expect(foodField).toBeInTheDocument();
    })
  });

  it('should have portion size field', () => {
    waitFor(() => {
      const portionField = getByTestId('portionField');
      expect(portionField).toBeInTheDocument();
    })
  });

  it('should have unit field', () => {
    waitFor(() => {
      const unitField = getByTestId('unitField');
      expect(unitField).toBeInTheDocument();
    })
  });

  it('should have dietary intake date field', () => {
    waitFor(() => {
      const dateField = getByTestId('dateField');
      expect(dateField).toBeInTheDocument();
    })
  });

  it('should have dietary intake time field', () => {
    waitFor(() => {
      const timeField = getByTestId('timeField');
      expect(timeField).toBeInTheDocument();
    })
  });
  
  it('should have save activity button', () => {
    waitFor(() => {
      const saveBtn = getByTestId('saveBtn');
      expect(saveBtn).toBeInTheDocument();
    })
  });

  useDispatchSpy.mockClear();
  useSelectorSpy.mockClear();
});