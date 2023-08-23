import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const ListEmptyComponent = ({ data }) => {
  if (!data) {
    return <View />;
  }
  return (
    <View style={styles.emptyListContainer}>
      <Text>Empty list</Text>
    </View>
  );
};

export default ListEmptyComponent;

const styles = StyleSheet.create({
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});
