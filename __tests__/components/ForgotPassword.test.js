import React from 'react';
import ForgotPassword from '../../components/ForgotPassword'
import renderer from 'react-test-renderer';
import { render, waitFor, act } from '@testing-library/react-native';

describe('Forgot Password', () => {
  const forgotPassword = renderer.create(
    <ForgotPassword />
  ).toJSON;

  it('should render successfully', async () => {
    await act(async () => {
      expect(forgotPassword).toBeDefined();
    })
  });

  it('should render correctly', async () => {
    await act(async () => {
      expect(forgotPassword).toMatchSnapshot();
    })
  });

  const { getByTestId } = render(<ForgotPassword />);

  it('should have email field', () => {
    waitFor(() => {
      const forgotPwdEmail = getByTestId('forgotPwdEmail');
      expect(forgotPwdEmail).toBeInTheDocument();
    })
  });

  it('should have continue button', () => {
    waitFor(() => {
      const forgotPwdBtn = getByTestId('forgotPwdBtn');
      expect(forgotPwdBtn).toBeInTheDocument();
    })
  });

  it('should have back to login button', () => {
    waitFor(() => {
      const loginBtn = getByTestId('loginBtn');
      expect(loginBtn).toBeInTheDocument();
    })
  });
});