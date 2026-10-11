import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { Link, useLocation } from 'react-router-native';
import { useState, useEffect } from 'react';
import useAuthStorage from './useAuthStorage';
import AddReview from './addreview';

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#24292e',
    paddingTop: Constants.statusBarHeight,
  },

  container: {
    flexDirection: 'row',
    padding: 10,
  },

  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 20,
  },
});

const AppBar = () => {
  const [token, setToken] = useState(null);
  const authStorage = useAuthStorage();
  const { pathname } = useLocation();

  useEffect(() => {
    let active = true;

    authStorage.getAccessToken()
      .then(storedToken => {
        if (active) {
          setToken(storedToken);
        }
      })
      .catch(error => {
        console.error('Failed to read the access token', error);
      });

    return () => {
      active = false;
    };
  }, [authStorage, pathname]);

return (
  <View style={styles.screen}>
    <ScrollView horizontal>
      <View style={styles.container}>
        <Link to="/">
          <Text style={styles.text}>Repositories</Text>
        </Link>

        {!token && (
          <Link to="/login">
            <Text style={styles.text}>Sign In</Text>
          </Link>
        )}
         {!token && (
          <Link to="/adduser">
            <Text style={styles.text}>Add User</Text>
          </Link>
        )}

        {token && (
          <>
          <Link to="/myreviews">
            <Text style={styles.text}>My reviews</Text>
          </Link>
            <Link to="/Addreview">
              <Text style={styles.text}>Add Review</Text>
            </Link>

            <Link to="/logout">
              <Text style={styles.text}>Sign Out</Text>
            </Link>
          </>
        )}
      </View>
    </ScrollView>
  </View>
);


};

export default AppBar;