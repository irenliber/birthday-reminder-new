import React from 'react';
import { View, StyleSheet } from 'react-native';
import Loading from '../components/Loading';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Loading />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
