import {
  render,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';

import { NativeRouter } from 'react-router-native';
import Login from '../login';

const mockSignIn = jest.fn();

jest.mock('../useSignIn', () => ({
  __esModule: true,
  default: () => [mockSignIn],
}));

describe('SignIn', () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    mockSignIn.mockResolvedValue({
      data: { login: { accessToken: 'fake-token' } },
    });
  });

  it('calls signIn with correct arguments when a valid form is submitted', async () => {
    const { getByPlaceholderText, getByText } = await render(
      <NativeRouter>
        <Login />
      </NativeRouter>
    );

    await fireEvent.changeText(getByPlaceholderText('Username'), 'kalle');
    await fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    await fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledTimes(1);
    });

    expect(mockSignIn).toHaveBeenCalledWith({
      username: 'kalle',
      password: 'password',
    });
  });
});