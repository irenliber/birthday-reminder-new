import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../utils/colors';

const SelectTile = ({ toggle, label, value }) => {
  return (
    <TouchableOpacity style={styles.birthdayContainer} onPress={toggle}>
      <View style={styles.birthdayLabelContainer}>
        <Text style={styles.birthdayLabel}>{label}</Text>
        <Text style={styles.birthdayValue}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SelectTile;

const styles = StyleSheet.create({
  birthdayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomColor: colors.light,
    borderBottomWidth: 2,
  },
  birthdayLabelContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  birthdayLabel: {
    fontSize: 18,
  },
  birthdayValue: {
    fontSize: 18,
    color: colors.active,
    fontWeight: '500',
  },
});
