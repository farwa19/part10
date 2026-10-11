
import { LOGIN } from './graphql/queries';
import { useMutation, useApolloClient } from '@apollo/client/react';
import useAuthStorage from './useAuthStorage';

const useSignIn = () => {
  const apolloClient = useApolloClient();
  const authStorage = useAuthStorage(); 
  const [mutate, result] = useMutation(LOGIN);

  const signIn = async ({ username, password }) => {
    const response = await mutate({
      variables: {
        credentials: { username, password },
      },
    });
    const accessToken = response.data?.authenticate?.accessToken;

    if (!accessToken) {
      throw new Error('Login response did not include an access token');
    }

    await authStorage.setAccessToken(accessToken);
    await apolloClient.resetStore();

    return response;
  };

  return [signIn, result];
};

export default useSignIn;