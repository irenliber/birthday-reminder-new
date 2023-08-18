import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import colors from '../utils/colors';
import i18n from '../utils/i18n';

const ListEmptySupport = ({ data }) => {
  const navigation = useNavigation();
  if (!data) {
    return <View />;
  }
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('NewItem')}
      style={styles.emptyListContainer}
    >
      <Text style={styles.title}>{i18n.t('hello')}</Text>
      <Text style={styles.desc}>{i18n.t('add_people_and_etc')}</Text>
    </TouchableOpacity>
  );
};

export default ListEmptySupport;

const styles = StyleSheet.create({
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    color: colors.vivid,
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 10,
  },
  desc: {
    color: colors.gray,
    fontSize: 18,
    fontWeight: '500',
  },
});
