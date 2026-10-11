import { render, waitFor } from '@testing-library/react-native';
import Logout from '../logout';
import useAuthStorage from '../useAuthStorage';
import { useApolloClient } from '@apollo/client/react';
import { useNavigate } from 'react-router-native';

jest.mock('../useAuthStorage');
jest.mock('@apollo/client/react', () => ({
  useApolloClient: jest.fn(),
}));
jest.mock('react-router-native', () => ({
  useNavigate: jest.fn(),
}));

describe('Logout', () => {
  const removeAccessToken = jest.fn();
  const clearStore = jest.fn();
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    removeAccessToken.mockResolvedValue();
    clearStore.mockResolvedValue();
    useAuthStorage.mockReturnValue({ removeAccessToken });
    useApolloClient.mockReturnValue({ clearStore });
    useNavigate.mockReturnValue(navigate);
  });

  it('removes the token and clears cached data before redirecting to login', async () => {
    render(<Logout />);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/login', { replace: true });
    });

    expect(removeAccessToken).toHaveBeenCalledTimes(1);
    expect(clearStore).toHaveBeenCalledTimes(1);
    expect(removeAccessToken.mock.invocationCallOrder[0]).toBeLessThan(
      clearStore.mock.invocationCallOrder[0]
    );
    expect(clearStore.mock.invocationCallOrder[0]).toBeLessThan(
      navigate.mock.invocationCallOrder[0]
    );
  });

  it('does not redirect when removing the token fails', async () => {
    const error = new Error('storage failed');
    removeAccessToken.mockRejectedValue(error);
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText } = render(<Logout />);

    await waitFor(() => {
      expect(getByText('Unable to sign out. Please try again.')).toBeTruthy();
    });

    expect(navigate).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
