import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useApolloClient } from '@apollo/client/react';
import { useNavigate } from 'react-router-native';
import useAuthStorage from './useAuthStorage';

const Logout = () => {
  const navigate = useNavigate();
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const signOut = async () => {
      try {
        await authStorage.removeAccessToken();
        await apolloClient.clearStore();
        navigate('/login', { replace: true });
      } catch (signOutError) {
        console.error('Failed to sign out', signOutError);
        if (active) {
          setError('Unable to sign out. Please try again.');
        }
      }
    };

    signOut();

    return () => {
      active = false;
    };
  }, [apolloClient, authStorage, navigate]);

  return error ? <Text>{error}</Text> : null;
};

export default Logout;