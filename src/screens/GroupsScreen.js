import React, { useLayoutEffect, useState } from 'react';
import { useActionSheet } from '@expo/react-native-action-sheet';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import useSWR, { mutate } from 'swr';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../utils/colors';
import i18n from '../utils/i18n';
import {
  createGroup,
  deleteGroup,
  fetchGroups,
  updateGroup,
} from '../api/groups';
import fmtPeopleCount from '../utils/fmtPeopleCount';
import DialogInput from 'react-native-dialog-input';

const GroupsScreen = ({ navigation }) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const { data } = useSWR('/api/groups', async () => {
    return await fetchGroups();
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogRenameId, setDialogRenameId] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setDialogVisible(true)}
        >
          <Text style={styles.doneBtn}>{i18n.t('add')}</Text>
        </TouchableOpacity>
      ),
    });
  }, [data]);
  return (
    <ScrollView style={styles.container}>
      {data?.list &&
        data.list.map(({ id, title, birthday_reminder_items_count, main }) => (
          <TouchableOpacity
            onPress={() => {
              let options = [i18n.t('rename_button')];
              if (!main) {
                options = [...options, i18n.t('delete')];
              }
              options = [...options, i18n.t('cancel')];
              let settings = {
                options,
                cancelButtonIndex: options.length - 1,
              };
              if (!main) {
                settings = {
                  ...settings,
                  destructiveButtonIndex: options.length - 2,
                };
              }
              showActionSheetWithOptions(settings, async (buttonIndex) => {
                if (buttonIndex === 0) {
                  setDialogRenameId(id);
                }
                if (buttonIndex === 1 && !main) {
                  await mutate('global_loading', true, false);
                  try {
                    await deleteGroup({
                      group: { id },
                    });
                    await mutate('/api/groups');
                    mutate('/api/birthdays');
                  } catch (e) {
                    console.log(e.response);
                    Alert.alert(
                      'Error',
                      'Something went wrong. Try again later'
                    );
                  } finally {
                    await mutate('global_loading', false, false);
                  }
                }
              });
            }}
            key={id}
            style={styles.tile}
          >
            <View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.desc}>
                {fmtPeopleCount(birthday_reminder_items_count, false, true)}
              </Text>
            </View>
            <AntDesign
              name="right"
              size={20}
              color={colors.vivid}
              style={styles.icon}
            />
          </TouchableOpacity>
        ))}
      <DialogInput
        cancelText={i18n.t('cancel')}
        submitText={i18n.t('submit')}
        modalStyle={styles.dialogInput}
        isDialogVisible={dialogVisible}
        title={i18n.t('new_group')}
        message={i18n.t('new_group_name')}
        submitInput={async (inputText) => {
          setDialogVisible(false);
          await mutate('global_loading', true, false);
          try {
            await createGroup({ group: { title: inputText } });
            await mutate('/api/groups');
          } catch (e) {
            console.log(e.response);
            Alert.alert('Error', 'Something went wrong. Try again later');
          } finally {
            await mutate('global_loading', false, false);
          }
        }}
        closeDialog={() => setDialogVisible(false)}
      ></DialogInput>
      <DialogInput
        cancelText={i18n.t('cancel')}
        submitText={i18n.t('ok')}
        modalStyle={styles.dialogInput}
        isDialogVisible={!!dialogRenameId}
        title={i18n.t('rename_dialog')}
        submitInput={async (inputText) => {
          setDialogRenameId(null);
          await mutate('global_loading', true, false);
          try {
            await updateGroup({
              group: { id: dialogRenameId, title: inputText },
            });
            await mutate('/api/groups');
            mutate('/api/birthdays');
          } catch (e) {
            console.log(e.response);
            Alert.alert('Error', 'Something went wrong. Try again later');
          } finally {
            await mutate('global_loading', false, false);
          }
        }}
        closeDialog={() => setDialogRenameId(null)}
      ></DialogInput>
    </ScrollView>
  );
};

export default GroupsScreen;

const styles = StyleSheet.create({
  tile: {
    paddingVertical: 10,
    borderBottomColor: colors.light,
    borderBottomWidth: 0.5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  desc: {
    color: colors.gray,
  },
  doneBtn: {
    color: colors.active,
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 16,
  },
  dialogInput: {
    backgroundColor: colors.transparentGray,
  },
});
