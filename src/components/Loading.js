import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import colors from '../utils/colors';

const Loading = () => {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="small" color={colors.text} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  loaderContainer: {
    marginVertical: 25,
    alignItems: 'center',
  },
});
