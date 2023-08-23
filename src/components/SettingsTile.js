import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../utils/colors';

const SettingsTile = ({ title, prefixIcon, action }) => {
  return (
    <TouchableOpacity onPress={action} style={styles.container}>
      <View style={styles.wrapper}>
        {prefixIcon && <View style={styles.prefixIcon}>{prefixIcon}</View>}
        <Text style={styles.text}>{title}</Text>
      </View>
      <AntDesign
        name="right"
        size={20}
        color={colors.vivid}
        style={styles.birthdayIcon}
      />
    </TouchableOpacity>
  );
};

export default SettingsTile;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: colors.light,
    borderBottomWidth: 0.5,
    paddingVertical: 15,
  },
  text: {
    fontSize: 18,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefixIcon: {
    marginRight: 10,
  },
});
