import React from 'react';
import { Alert, View, StyleSheet, Platform } from 'react-native';
import { mutate } from 'swr';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as MailComposer from 'expo-mail-composer';
import * as Application from 'expo-application';
import SettingsTile from '../components/SettingsTile';
import colors from '../utils/colors';
import i18n from '../utils/i18n';
import {useStore} from "@nanostores/react";
import {user} from "../store/user";

const SettingsScreen = ({ navigation }) => {
  const { id } = useStore(user);

  return (
    <View style={styles.container}>
      <SettingsTile
        action={() => navigation.navigate('Reminders')}
        prefixIcon={
          <AntDesign
            name="bells"
            size={30}
            color={colors.vivid}
            style={styles.birthdayIcon}
          />
        }
        title={i18n.t('daily_reminders')}
      />
      <SettingsTile
        action={() => navigation.navigate('Groups')}
        prefixIcon={
          <AntDesign
            name="team"
            size={30}
            color={colors.vivid}
            style={styles.birthdayIcon}
          />
        }
        title={i18n.t('groups')}
      />
      <SettingsTile
        action={() => navigation.navigate('ShareList')}
        prefixIcon={
          <AntDesign
            name="export"
            size={30}
            color={colors.vivid}
            style={styles.birthdayIcon}
          />
        }
        title={i18n.t('share_list')}
      />
      <SettingsTile
        action={() =>
          navigation.navigate('WebView', {
            title: i18n.t('privacy_policy'),
            uri:
              'https://www.privacypolicygenerator.info/live.php?token=fvgZ4SVm3MR7JrLODTNkVpF6VloW3q6r',
          })
        }
        prefixIcon={
          <AntDesign
            name="Safety"
            size={30}
            color={colors.vivid}
            style={styles.birthdayIcon}
          />
        }
        title={i18n.t('privacy_policy')}
      />
      <SettingsTile
        action={() =>
          navigation.navigate('WebView', {
            title: i18n.t('terms_of_use'),
            uri:
              'https://www.termsofusegenerator.net/live.php?token=htvLSqAONzcJLCphMilAIxPefpSt2H8K',
          })
        }
        prefixIcon={
          <AntDesign
            name="link"
            size={30}
            color={colors.vivid}
            style={styles.birthdayIcon}
          />
        }
        title={i18n.t('terms_of_use')}
      />
      <SettingsTile
        action={async () => {
          try {
            let body = '\n\n\n';
            body += '_____________\n';
            body += `Version: ${Application.nativeApplicationVersion}\n`;
            body += `Build: ${Application.nativeBuildVersion}\n`;
            body += `UserId: ${id}\n`;
            body += `Platform: ${Platform.OS}`;
            await MailComposer.composeAsync({
              recipients: ['vitalyliber@gmail.com'],
              subject: 'Some Feedback',
              body,
            });
          } catch (e) {
            console.log(e);
          }
        }}
        prefixIcon={
          <AntDesign
            name="contacts"
            size={30}
            color={colors.vivid}
            style={styles.birthdayIcon}
          />
        }
        title={i18n.t('contact_us')}
      />
      {/*<SettingsTile*/}
      {/*  prefixIcon={*/}
      {/*    <AntDesign*/}
      {/*      name="deleteuser"*/}
      {/*      size={30}*/}
      {/*      color={colors.vivid}*/}
      {/*      style={styles.birthdayIcon}*/}
      {/*    />*/}
      {/*  }*/}
      {/*  title={i18n.t('logout')}*/}
      {/*  action={() => {*/}
      {/*    Alert.alert(*/}
      {/*      i18n.t('logout'),*/}
      {/*      i18n.t('are_you_sure'),*/}
      {/*      [*/}
      {/*        {*/}
      {/*          text: i18n.t('cancel'),*/}
      {/*          onPress: () => console.log('Cancel Pressed'),*/}
      {/*          style: 'cancel',*/}
      {/*        },*/}
      {/*        {*/}
      {/*          text: i18n.t('yes'),*/}
      {/*          onPress: async () => {*/}
      {/*            await mutate('global_loading', true, false);*/}
      {/*            await AsyncStorage.removeItem('id');*/}
      {/*            await AsyncStorage.removeItem('type');*/}
      {/*            await mutate('global_loading', false, false);*/}
      {/*            navigation.replace('SignIn');*/}
      {/*            await mutate('/api/birthdays', null, false);*/}
      {/*          },*/}
      {/*        },*/}
      {/*      ],*/}
      {/*      { cancelable: false }*/}
      {/*    );*/}
      {/*  }}*/}
      {/*/>*/}
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
