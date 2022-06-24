import React from 'react';
import Launchpage from '../../components/Launchpage'
import renderer from 'react-test-renderer';
import { render, waitFor, act } from '@testing-library/react-native';

describe('Launchpage', () => {
  const launchPage = renderer.create(
    <Launchpage />
  ).toJSON;

  it('should render successfully', async () => {
    await act(async () => {
      expect(launchPage).toBeDefined();
    })
  });

  it('should render correctly', async () => {
    await act(async () => {
      expect(launchPage).toMatchSnapshot();
    })
  });

  const { getByTestId } = render(<Launchpage />);

  it('should have login button', () => {
    waitFor(() => {
      const loginButton = getByTestId('launchLoginButton');
      expect(loginButton).toBeInTheDocument();
    })
  });

  it('should have sign up button', () => {
    waitFor(() => {
      const signUpButton = getByTestId('launchSignupButton');
      expect(signUpButton).toBeInTheDocument();
    })
  });
});