import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
// import Swipeable from 'react-native-gesture-handler/Swipeable';
import colors from '../utils/colors';
import { RectButton } from 'react-native-gesture-handler';
import { deleteBirthday } from '../api/birthdays';
import { mutate } from 'swr';
import formatDateNumber from '../utils/formatDateNumber';
import countBeforeDaysHook from '../hooks/countBeforeDaysHook';
import countNextTurning from '../hooks/countNextTurning';
import i18n from '../utils/i18n';
import computeLabel from '../hooks/computeLabel';

const ItemTile = (params) => {
  const {
    birthday_reminder_item: {
      first_name,
      last_name,
      reminder_avatar: { url },
    },
    id: eventId,
    day_at,
    month_at,
    year_at,
    category,
    title,
  } = params;
  const navigation = useNavigation();
  const [removing, setRemoving] = useState(false);
  const nextTurning = countNextTurning({ day_at, month_at, year_at });
  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });
    return (
      <RectButton
        style={styles.rightAction}
        onPress={async () => {
          try {
            setRemoving(true);
            await deleteBirthday({ eventId });
            mutate('/api/birthdays');
          } catch (e) {
            console.log(e);
            setRemoving(false);
          }
        }}
      >
        {!removing && (
          <Animated.Text
            style={[
              styles.rightActionText,
              {
                transform: [{ translateX: trans }],
              },
            ]}
          >
            Delete
          </Animated.Text>
        )}
        {removing && <ActivityIndicator size="small" color={colors.white} />}
      </RectButton>
    );
  };
  const daysBefore = countBeforeDaysHook({ day_at, month_at });
  const label = computeLabel({ nextTurning, category, title });
  return (
    <>
      {/*<Swipeable renderRightActions={renderLeftActions}>*/}
      <TouchableOpacity
        onPress={() => navigation.navigate('Event', params)}
        activeOpacity={1}
        style={styles.container}
      >
        <Image
          style={styles.avatar}
          indicator={ProgressBar.Pie}
          indicatorProps={{
            size: 80,
            borderWidth: 0,
            color: 'rgba(150, 150, 150, 1)',
            unfilledColor: 'rgba(200, 200, 200, 0.2)',
          }}
          source={{ uri: url }}
        />
        <View style={styles.infoWrapper}>
          <View style={styles.nameWrapper}>
            <View style={styles.textNameWrapper}>
              <Text numberOfLines={1} style={styles.textName}>
                {first_name} {last_name}
              </Text>
            </View>
            <View style={styles.textDaysWrapper}>
              {daysBefore !== 0 ? (
                <Text style={styles.textDays}>{daysBefore}</Text>
              ) : (
                <AntDesign name="star" size={20} color={colors.red} />
              )}
            </View>
          </View>
          <View style={styles.dateWrapper}>
            <View style={styles.textBirthdayWrapper}>
              <Text numberOfLines={1} style={styles.textBirthday}>
                {[formatDateNumber(day_at), formatDateNumber(month_at)]
                  .filter((el) => !!el)
                  .join('.')}{' '}
                • {label}
              </Text>
            </View>
            <View style={styles.textDaysTitleWrapper}>
              <Text style={styles.textDaysTitle}>
                {daysBefore !== 0
                  ? i18n.t('days', { count: daysBefore })
                  : ''}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {/*</Swipeable>*/}
    </>
  );
};

export default ItemTile;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 50,
    marginRight: 20,
    overflow: 'hidden',
    backgroundColor: colors.ultraLight,
  },
  nameWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  infoWrapper: {
    flexDirection: 'column',
    flex: 1,
  },
  dateWrapper: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  textNameWrapper: {
    flex: 1.4,
  },
  textName: {
    fontSize: 16,
    color: colors.text,
    fontWeight: 'bold',
  },
  textBirthday: {
    fontSize: 16,
    color: colors.gray,
  },
  textBirthdayWrapper: {
    flex: 1.4,
  },
  textDaysTitleWrapper: {
    flex: 0.6,
    alignItems: 'flex-end',
  },
  textDaysWrapper: {
    flex: 0.6,
    alignItems: 'flex-end',
  },
  textDays: {
    fontSize: 16,
    color: colors.text,
    fontWeight: 'bold',
  },
  textDaysTitle: {
    fontSize: 16,
    color: colors.gray,
  },
  rightAction: {
    width: 100,
    justifyContent: 'center',
    backgroundColor: colors.red,
    alignItems: 'center',
  },
  rightActionText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});
