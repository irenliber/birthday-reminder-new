import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import formatDateNumber from '../utils/formatDateNumber';
import colors from '../utils/colors';
import computeLabel from '../hooks/computeLabel';

const SharedListTile = ({
  setList,
  list,
  item: {
    id,
    title,
    day_at,
    month_at,
    year_at,
    selected,
    category,
    birthday_reminder_item: {
      first_name,
      last_name,
      reminder_avatar: { url },
    },
  },
}) => {
  const label = computeLabel({ category, title });
  return (
    <TouchableOpacity
      onPress={() =>
        setList(
          list?.map((el) =>
            el.id === id ? { ...el, selected: !el.selected } : el
          )
        )
      }
      style={styles.tile}
      key={id}
    >
      <View style={styles.leftWrapper}>
        <Image style={styles.avatar} source={{ uri: url }} />
        <View>
          <Text style={styles.fullName}>
            {first_name} {last_name}
          </Text>
          <Text style={styles.dateText}>
            {[formatDateNumber(day_at), formatDateNumber(month_at), year_at]
              .filter((el) => !!el)
              .join('.')}{' '}
            • {label}
          </Text>
        </View>
      </View>
      {selected && (
        <AntDesign
          name="checkcircle"
          size={25}
          color={colors.vivid}
          style={styles.icon}
        />
      )}
      {!selected && <View style={styles.circle} />}
    </TouchableOpacity>
  );
};

export default SharedListTile;

const styles = StyleSheet.create({
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 50,
    marginRight: 20,
  },
  tile: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullName: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateText: {
    color: colors.gray,
    marginTop: 4,
  },
  circle: {
    borderRadius: 50,
    height: 25,
    width: 25,
    borderColor: colors.light,
    borderWidth: 2,
  },
});
