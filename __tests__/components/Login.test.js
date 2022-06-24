import React from 'react';
import Login from '../../components/Login'
import renderer from 'react-test-renderer';
import { render, waitFor, act } from '@testing-library/react-native';

describe('Login', () => {
  const loginPage = renderer.create(
    <Login />
  ).toJSON;

  const { getByTestId } = render(<Login />);

  it('should render successfully', async () => {
    await act(async () => {
      expect(loginPage).toBeDefined();
    })
  });

  it('should render correctly', async () => {
    await act(async () => {
      expect(loginPage).toMatchSnapshot();
    })
  });

  it('should have email field', () => {
    waitFor(() => {
      const loginEmail = getByTestId('loginEmail');
      expect(loginEmail).toBeInTheDocument();
    })
  });

  it('should have password field', () => {
    waitFor(() => {
      const loginPassword = getByTestId('loginPassword');
      expect(loginPassword).toBeInTheDocument();
    })
  });

  it('should have forgot password button', () => {
    waitFor(() => {
      const forgotPassword = getByTestId('forgotPassword');
      expect(forgotPassword).toBeInTheDocument();
    })
  });

  it('should have login button', () => {
    waitFor(() => {
      const loginButton = getByTestId('loginButton');
      expect(loginButton).toBeInTheDocument();
    })
  })

  it('should have create account button', () => {
    waitFor(() => {
      const createAccText = getByTestId('createAccText');
      expect(createAccText).toBeInTheDocument();
    })
  })
});