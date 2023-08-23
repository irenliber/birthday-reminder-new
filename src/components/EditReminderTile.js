import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../utils/colors';

const EditReminderTile = ({
  leftText,
  leftStyles,
  rightText,
  action,
  showIcon = true,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={action}
      disabled={disabled}
      style={styles.container}
    >
      <Text style={[styles.label, leftStyles]}>{leftText}</Text>
      <View style={styles.wrapper}>
        <Text style={styles.value}>{rightText}</Text>
        {showIcon && (
          <AntDesign
            name="right"
            size={20}
            color={colors.vivid}
            style={styles.icon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default EditReminderTile;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: colors.light,
    borderBottomWidth: 0.5,
  },
  label: {
    fontSize: 18,
  },
  value: {
    fontSize: 18,
    color: colors.gray,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginLeft: 10,
  },
});
