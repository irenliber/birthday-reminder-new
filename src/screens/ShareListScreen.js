import React, { useEffect, useLayoutEffect, useState, useMemo } from 'react';
import {
  Share,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import i18n from '../utils/i18n';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../utils/colors';
import useSWR from 'swr';
import { fetchBirthdays } from '../api/birthdays';
import { createBackup } from '../api/backups';
import ListEmptyComponent from '../components/ListEmptyComponent';
import SharedListTile from '../components/SharedListTile';

const ShareListScreen = ({ navigation }) => {
  const [list, setList] = useState(null);
  const { data } = useSWR('/api/birthdays', async () => {
    return await fetchBirthdays();
  });
  const selectedEvents = useMemo(() => {
    return list?.filter((el) => el.selected);
  }, [list]);
  const selectedCount = useMemo(() => {
    return selectedEvents?.length || 0;
  }, [selectedEvents]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          hitSlop={{ top: 20, bottom: 10, left: 20, right: 20 }}
          onPress={() => {
            const selected = !list?.every((el) => el.selected);
            setList(list?.map((el) => ({ ...el, selected })));
          }}
        >
          <Text style={styles.allBtn}>{i18n.t('all')}</Text>
        </TouchableOpacity>
      ),
    });
  }, [list]);
  useEffect(() => {
    setList(data?.list.map((el) => ({ ...el, selected: false })));
  }, [data]);
  const onShare = async () => {
    try {
      const { link } = await createBackup({
        backup: {
          birthday_backups_events_attributes: selectedEvents.map(({ id }) => ({
            birthday_event_id: id,
          })),
        },
      });
      const result = await Share.share({
        message: i18n.t('share_events_message', {
          events: i18n.t('events', { count: selectedCount }).toLowerCase(),
          count: selectedCount,
          link,
        }),
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          setList(data?.list.map((el) => ({ ...el, selected: false })));
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        {list && list.length === 0 && <ListEmptyComponent data={data} />}
        {list &&
          list.map((item) => (
            <SharedListTile
              key={item.id}
              item={item}
              list={list}
              setList={setList}
            />
          ))}
      </ScrollView>
      {selectedCount > 0 && (
        <TouchableOpacity onPress={onShare} style={styles.bottomBtn}>
          <Text style={styles.bottomTxt}>
            {i18n.t('share_events_title', {
              selectedCount,
              events: i18n
                .t('shared_list_events', { count: selectedCount })
                .toLowerCase(),
            })}
          </Text>
          <AntDesign
            name="sharealt"
            size={25}
            color={colors.white}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ShareListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  allBtn: {
    color: colors.active,
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 16,
  },
  bottomBtn: {
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: colors.active,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomTxt: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 16,
  },
});
