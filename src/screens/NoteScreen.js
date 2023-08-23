import React, { useState, useLayoutEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import colors from '../utils/colors';
import { updateBirthday } from '../api/birthdays';
import { mutate } from 'swr';

const NoteScreen = ({ navigation, route: { params } }) => {
  const {
    birthday_reminder_item: { id, note },
  } = params;
  const [value, setValue] = useState(note);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: () => {
        return (
          <TouchableOpacity
            onPress={async () => {
              try {
                await mutate('global_loading', true, false);
                await updateBirthday({
                  id,
                  item: { note: value },
                });
                mutate('/api/birthdays');
                navigation.navigate('Event', {
                  ...params,
                  birthday_reminder_item: {
                    ...params.birthday_reminder_item,
                    note: value,
                  },
                });
              } catch (e) {
                console.log(e);
                Alert.alert('Error', 'Something went wrong. Try again later');
              } finally {
                await mutate('global_loading', false, false);
              }
            }}
          >
            <Text style={styles.saveBtn}>Save</Text>
          </TouchableOpacity>
        );
      },
    });
  }, [value]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        keyboardVerticalOffset={100}
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
      >
        <ScrollView style={styles.scrollView}>
          <TextInput
            style={styles.textInput}
            value={value}
            multiline
            autoFocus
            autogrow
            onChangeText={(text) => {
              setValue(text);
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default NoteScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  textInput: {
    paddingTop: 15,
    width: '100%',
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  saveBtn: {
    color: colors.active,
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 16,
  },
});
