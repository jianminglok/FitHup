import React from 'react';
import Signup from '../../components/Signup'
import renderer from 'react-test-renderer';
import { render, waitFor, act } from '@testing-library/react-native';

describe('Signup', () => {
  const signUp = renderer.create(
    <Signup />
  ).toJSON;

  it('should render successfully', async () => {
    await act(async () => {
      expect(signUp).toBeDefined();
    })
  });

  it('should render correctly', async () => {
    await act(async () => {
      expect(signUp).toMatchSnapshot();
    })
  });

  const { getByTestId } = render(<Signup />);

  it('should have email field', () => {
    waitFor(() => {
      const signUpEmail = getByTestId('signUpEmail');
      expect(signUpEmail).toBeInTheDocument();
    })
  });

  it('should have password field', () => {
    waitFor(() => {
      const signUpPassword = getByTestId('signUpPassword');
      expect(signUpPassword).toBeInTheDocument();
    })
  });

  it('should have confirm password field', () => {
    waitFor(() => {
      const signUpConfirmPassword = getByTestId('signUpConfirmPassword');
      expect(signUpConfirmPassword).toBeInTheDocument();
    })
  });

  it('should have sign up button', () => {
    waitFor(() => {
      const signUpButton = getByTestId('signUpButton');
      expect(signUpButton).toBeInTheDocument();
    })
  });

  it('should have login button', () => {
    waitFor(() => {
      const loginButton = getByTestId('loginButton');
      expect(loginButton).toBeInTheDocument();
    })
  });
});