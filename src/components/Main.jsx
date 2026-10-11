import Constants from 'expo-constants';
import {  StyleSheet, View } from 'react-native';
import RepositoryList from './RepositoryList';
import {  Route, Routes, Navigate } from 'react-router-native';
import AppBar from './AppBar';
import Text from './Text';
import Login from './login';
import Logout from './logout';
import Addreview  from './addreview'
import SingleRepository from './Ripositorysingleitem';
import MYREV from './myrev';

import Adduser from './adduser'
const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
  },
});
//addlogin page
const Main = () => {
  return (
   

    <View style={styles.container}>
         <AppBar><Text>HI Everyone</Text></AppBar>
       
         <Routes>
        <Route path="/" element={<RepositoryList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/addreview" element={<Addreview />} />
        <Route path="/myreviews" element={<MYREV />} />
        <Route path="/adduser" element={<Adduser />} />
        <Route path="/repository/:id" element={<SingleRepository />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
   
    </View>
  );
};

export default Main;