import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/client/react';
import AuthStorageContext from './src/contexts/AuthStorageContext';
import Main from './src/components/Main';
import createApolloClient from './src/components/utills/apolloClient';
import AuthStorage from './src/components/utills/authStorage';

const authStorage = new AuthStorage();
const apolloClient = createApolloClient(authStorage);


const App = () => 
  
  {
  return (
    <>
    
      <StatusBar style="auto" />

      <ApolloProvider client={apolloClient}>
        <NativeRouter>
           <AuthStorageContext.Provider value={authStorage}>
          <Main />
          </AuthStorageContext.Provider>
        </NativeRouter>
      </ApolloProvider>
    </>
  );
};

export default App;
