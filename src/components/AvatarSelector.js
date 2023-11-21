import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import colors from '../utils/colors';
import {useActionSheet} from '@expo/react-native-action-sheet';
import Constants from 'expo-constants';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {useNavigation} from '@react-navigation/native';

import formatDateNumber from '../utils/formatDateNumber';
import getZodiacSign from '../utils/getZodiacSign';
import capitalize from '../utils/capitalize';
import countBeforeDaysHook from '../hooks/countBeforeDaysHook';
import countNextTurning from '../hooks/countNextTurning';
import i18n from '../utils/i18n';
import computeLabel from '../hooks/computeLabel';

const AvatarSelector = (props) => {
  const {
    avatarUrl,
    image,
    setImage,
    setAvatarId,
    setAvatarUrl,
    disabled,
    user,
  } = props;
  const {
    birthday_reminder_item: {first_name, last_name},
    day_at,
    month_at,
    year_at,
    title,
    category,
  } = user || {birthday_reminder_item: {}};
  const {showActionSheetWithOptions} = useActionSheet();
  const navigation = useNavigation();

  const cameraPermission = async () => {
    await Camera.requestCameraPermissionsAsync();
  }

  const libraryPermission = async () => {
    let { granted } = await MediaLibrary.getPermissionsAsync()
    if (granted) return true;

    let { status } = await MediaLibrary.requestPermissionsAsync();

    return (status === "granted");
  }

  const openPhotoLibrary = async (isLibrary = true) => {
    if (Constants.platform.ios) {
      const granted = isLibrary ?  await libraryPermission() : await cameraPermission();
      if (!granted) {
        alert(
          `Sorry, we need camera ${
            isLibrary && 'roll'
          } permissions to make this work!`
        );
      }
    }
    try {
      const mainFunc = isLibrary
        ? ImagePicker.launchImageLibraryAsync
        : ImagePicker.launchCameraAsync;
      let result = await mainFunc({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri)
      }
    } catch (e) {
      console.log(e);
    }
  };

  const zodiacSign = getZodiacSign(day_at, month_at);
  const daysBefore = countBeforeDaysHook({day_at, month_at});
  const nextTurning = countNextTurning({day_at, month_at, year_at});
  const label = computeLabel({category, title});

  return (
    <View style={styles.avatarWrapper}>
      <TouchableOpacity
        disabled={disabled}
        style={styles.avatarBtn}
        onPress={() => {
          showActionSheetWithOptions(
            {
              options: [
                i18n.t('avatars_library'),
                i18n.t('take_picture'),
                i18n.t('choose_picture'),
                i18n.t('cancel'),
              ],
              cancelButtonIndex: 3,
            },
            (buttonIndex) => {
              if (buttonIndex === 0) {
                navigation.navigate('AvatarsLibrary', {
                  setAvatarId,
                  setAvatarUrl,
                  setImage,
                });
              }
              if (buttonIndex === 2) {
                openPhotoLibrary();
              }
              if (buttonIndex === 1) {
                openPhotoLibrary(false);
              }
            }
          );
        }}
      >
        <View style={styles.avatarContainer}>
          {(avatarUrl || image) && (
            <Image
              style={styles.avatar}
              source={{
                uri: image || avatarUrl,
              }}
              indicator={ProgressBar.Pie}
              indicatorProps={{
                size: 80,
                borderWidth: 0,
                color: 'rgba(150, 150, 150, 1)',
                unfilledColor: 'rgba(200, 200, 200, 0.2)',
              }}
            />
          )}
        </View>
        {!disabled && (
          <View style={styles.changePhotoBtn}>
            <Text style={styles.changePhotoTxt}>{i18n.t('change_photo')}</Text>
          </View>
        )}
        {disabled && (
          <View style={styles.userNameWrapper}>
            <Text numberOfLines={1} style={styles.userName}>
              {first_name} {last_name}
            </Text>
            <Text numberOfLines={1} style={styles.date}>
              {[formatDateNumber(day_at), formatDateNumber(month_at), year_at]
                .filter((el) => !!el)
                .join('.')}{' '}
              • {label}
            </Text>
            {category === 'birthday' && (
              <View style={styles.zodiacSignWrapper}>
                <MaterialCommunityIcons
                  name={`zodiac-${zodiacSign}`}
                  size={16}
                  color={colors.white}
                  style={styles.birthdayIcon}
                />
                <Text style={styles.zodiacSign}>
                  {capitalize(i18n.t(zodiacSign))}
                </Text>
              </View>
            )}

            {nextTurning > 0 && (
              <View style={styles.turningWrapper}>
                <Text style={styles.turningTxt}>
                  {category === 'birthday'
                    ? i18n.t('turning', {nextTurning})
                    : i18n.t('anniversary_turning', {nextTurning})}
                </Text>
              </View>
            )}
            <View style={styles.counterBeforeWrapper}>
              {daysBefore > 0 && (
                <Text style={styles.counterBefore}>
                  {daysBefore} {i18n.t('days', {count: daysBefore})}
                </Text>
              )}
              {daysBefore === 0 && (
                <Text style={styles.counterBefore}>
                  {i18n.t('celebrates_today_short')}
                </Text>
              )}
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AvatarSelector;

const styles = StyleSheet.create({
  avatarWrapper: {
    backgroundColor: colors.main,
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarBtn: {
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    overflow: 'hidden',
  },
  changePhotoBtn: {
    marginTop: 15,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  changePhotoTxt: {
    color: colors.white,
    fontWeight: 'bold',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    borderWidth: 4,
    borderColor: colors.white,
  },
  userNameWrapper: {
    marginTop: 15,
    alignItems: 'center',
  },
  userName: {
    color: colors.white,
    fontSize: 18,
  },
  date: {
    color: colors.white,
    fontSize: 14,
    marginTop: 5,
  },
  zodiacSignWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  zodiacSign: {
    color: colors.white,
    fontSize: 14,
    marginLeft: 5,
  },
  counterBeforeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  counterBefore: {
    fontSize: 22,
    color: colors.white,
  },
  turningWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  turningTxt: {
    fontSize: 16,
    color: colors.white,
  },
});
