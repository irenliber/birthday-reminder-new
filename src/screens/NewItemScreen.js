import React, { useState, useLayoutEffect, useEffect, useMemo } from 'react';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useActionSheet } from '@expo/react-native-action-sheet';

import useSWR, { mutate } from 'swr';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import InputScrollView from 'react-native-input-scroll-view';
import TextInputBlock from '../components/TextInputBlock';
import colors from '../utils/colors';
import {
  createBirthday,
  fetchBirthdays,
  updateBirthday,
  updateImageBirthday,
} from '../api/birthdays';
import { fetchAvatars } from '../api/avatars';
import AvatarSelector from '../components/AvatarSelector';
import EventTile from '../components/EventTile';
import { fetchGroups } from '../api/groups';
import SelectTile from '../components/SelectTile';
import i18n from '../utils/i18n';

const NewItemScreen = ({ navigation, route }) => {
  const { data: tab } = useSWR('tab', () => 'Birthdays', false);
  const { showActionSheetWithOptions } = useActionSheet();
  const { data: eventsData } = useSWR('/api/birthdays', async () => {
    return await fetchBirthdays();
  });
  const { data: groupsData } = useSWR('/api/groups', async () => {
    return await fetchGroups();
  });
  const { params } = route;
  const [events, setEvents] = useState([
    {
      active: false,
      title: 'Birthday',
      category: 'birthday',
    },
    {
      active: false,
      title: 'Anniversary',
      category: 'anniversary',
    },
    {
      active: false,
      title: i18n.t('custom_event'),
      category: 'custom',
    },
  ]);
  const [image, setImage] = useState(null);
  const [avatarId, setAvatarId] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdayGroup, setBirthdayGroup] = useState(0);
  const currentBirthdayGroup = useMemo(() => {
    if (groupsData?.list) {
      if (birthdayGroup) {
        return groupsData.list.find((el, index) => index === birthdayGroup);
      } else {
        return groupsData.list[0];
      }
    }
    return null;
  }, [birthdayGroup, groupsData]);
  const updateValue = (index, params, clear = false) => {
    let newEvents = [];
    if (clear) {
      const event = events.find((el, i) => i === index);
      if (
        event.category === 'custom' &&
        events.filter((el) => el.category === 'custom').length > 1
      ) {
        // remove custom events
        newEvents = events.filter((el, i) => i !== index);
      } else {
        // clear other fields for birthday/anniversary categories
        newEvents = events.map((el, i) => {
          if (i === index) {
            return { active: false, title: el.title, category: el.category };
          } else {
            return el;
          }
        });
      }
      if (event.id) {
        newEvents = [
          ...newEvents,
          { id: event.id, _destroy: '1', active: false },
        ];
      }
    } else {
      newEvents = events.map((el, i) =>
        i === index ? { ...el, ...params } : el
      );
    }

    setEvents(newEvents);
  };
  const isCustomActive = useMemo(
    () =>
      events
        .filter((el) => el.category === 'custom')
        .every((val, i, arr) => val.active),
    [events]
  );
  useEffect(() => {
    if (isCustomActive) {
      setEvents([
        ...events,
        {
          active: false,
          title: i18n.t('custom_event'),
          category: 'custom',
        },
      ]);
    }
  }, [isCustomActive]);
  useEffect(() => {
    if (params) {
      const {
        birthday_reminder_item: {
          first_name,
          last_name,
          birthday_group_id,
          birthday_reminder_avatar_id,
          reminder_avatar: { url },
          id,
        },
      } = params;
      setFirstName(first_name);
      setLastName(last_name);
      setAvatarId(birthday_reminder_avatar_id);
      setImage(url);
      if (groupsData?.list) {
        const groupFromApiIndex = groupsData.list.findIndex(
          (el) => el.id === birthday_group_id
        );
        if (groupFromApiIndex) {
          setBirthdayGroup(groupFromApiIndex);
        }
      }
      if (eventsData?.list) {
        const apiEvents = eventsData?.list
          .filter((el) => el.birthday_reminder_item.id === id)
          .map((el) => {
            return {
              id: el.id,
              title: el.title,
              category: el.category,
              day_at: el.day_at,
              month_at: moment(el.month_at, 'MM').format('MMM'),
              year_at: el.year_at,
              withYear: !!el.year_at,
              active: true,
            };
          });
        let mergedEvents = [];
        events.forEach((el) => {
          if (el.category === 'birthday') {
            const birthdayEl = apiEvents.find(
              (apiEl) => apiEl.category === 'birthday'
            );
            if (birthdayEl) {
              mergedEvents = [...mergedEvents, birthdayEl];
            } else {
              mergedEvents = [...mergedEvents, el];
            }
          }
          if (el.category === 'anniversary') {
            const anniversaryEl = apiEvents.find(
              (apiEl) => apiEl.category === 'anniversary'
            );
            if (anniversaryEl) {
              mergedEvents = [...mergedEvents, anniversaryEl];
            } else {
              mergedEvents = [...mergedEvents, el];
            }
          }
          if (el.category === 'custom') {
            const customElements = apiEvents.filter(
              (apiEl) => apiEl.category === 'custom'
            );
            if (customElements.length > 0) {
              mergedEvents = [...mergedEvents, ...customElements, el];
            } else {
              mergedEvents = [...mergedEvents, el];
            }
          }
        });
        setEvents(mergedEvents);
      }
    }
  }, [params]);
  const { data } = useSWR('/api/avatars', async () => {
    return await fetchAvatars();
  });
  useEffect(() => {
    if (data?.list && !params) {
      const firstElement = data.list[0];
      setAvatarId(firstElement.id);
      setAvatarUrl(firstElement.image.url);
    }
  }, [data]);

  const create = async () => {
    await mutate('global_loading', true, false);
    try {
      let id;
      const birthday_events_attributes = events
        .filter((el) => el.active || el._destroy)
        .map((el) => {
          let event = {
            title: el.title,
            day_at: el.day_at,
            month_at: moment(el.month_at, 'MMM').format('M'),
            year_at: el.withYear ? el.year_at : '',
            category: el.category,
          };
          if (el.id) {
            event = { ...event, id: el.id };
          }
          if (el._destroy) {
            event = { ...event, _destroy: el._destroy };
          }
          return event;
        });
      const item = {
        note: '',
        birthday_reminder_avatar_id: avatarId,
        first_name: firstName,
        last_name: lastName,
        birthday_group_id: currentBirthdayGroup.id,
        birthday_events_attributes,
      };
      if (!params) {
        const result = await createBirthday({ item });
        id = result.id;
      } else {
        id = params.birthday_reminder_item.id;
      }
      if (!params) {
        if (image) {
          await updateImageBirthday({ image, id });
        }
      } else {
        if (image && !image.includes('https://')) {
          await updateImageBirthday({ image, id });
        }
        const result = await updateBirthday({ id, item });
        const currentEvent = birthday_events_attributes.find(
          (el) => el.id === params.id
        );
        if (currentEvent?._destroy) {
          if (tab === 'Calendar') {
            navigation.navigate('Calendar');
          } else {
            navigation.navigate('Birthdays');
          }
        } else {
          if (params.toScreen) {
            // for right returning from SearchFriendsScreen
            navigation.navigate(params.toScreen);
          } else {
            navigation.navigate('Event', {
              birthday_reminder_item: result,
              ...currentEvent,
            });
          }
        }
      }
      mutate('/api/birthdays');
      mutate('/api/groups');
      if (!params) {
        navigation.goBack();
      }
    } catch (e) {
      console.log(e.response);
      Alert.alert('Error', 'Something went wrong. Try again later');
    } finally {
      await mutate('global_loading', false, false);
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${firstName} ${lastName}`,
      headerRight: () => {
        let active = firstName;
        if (!params) {
          active = active && events.some((el) => el.active);
        }
        return (
          <TouchableOpacity
            disabled={!active}
            style={styles.editBtn}
            onPress={create}
          >
            <Text style={[styles.doneBtn, !active && styles.doneBtnDisabled]}>
              {i18n.t('done')}
            </Text>
          </TouchableOpacity>
        );
      },
    });
  }, [firstName, lastName, events, image, avatarId, currentBirthdayGroup]);
  const filteredEvents = useMemo(() => events.filter((el) => !el._destroy), [
    events,
  ]);
  return (
    <View style={styles.container}>
      <InputScrollView>
        <AvatarSelector
          avatarUrl={avatarUrl}
          image={image}
          setImage={setImage}
          setAvatarId={setAvatarId}
          setAvatarUrl={setAvatarUrl}
        />
        <TextInputBlock
          value={firstName}
          setValue={setFirstName}
          label={i18n.t('first_name')}
          placeholder={i18n.t('first_name')}
        />
        <TextInputBlock
          value={lastName}
          setValue={setLastName}
          label={i18n.t('last_name')}
          placeholder={i18n.t('last_name')}
        />
        {!params && (
          <SelectTile
            toggle={() => navigation.navigate('SearchFriends')}
            label={i18n.t('choose_existing')}
            value={
              <AntDesign
                name="right"
                size={20}
                color={colors.vivid}
                style={styles.icon}
              />
            }
          />
        )}
        {currentBirthdayGroup && (
          <SelectTile
            value={currentBirthdayGroup?.title}
            label={i18n.t('group')}
            toggle={() => {
              const groupsList = groupsData.list.map((el) => el.title);
              showActionSheetWithOptions(
                {
                  title: i18n.t('group'),
                  message: i18n.t('group_action_message'),
                  options: [...groupsList, i18n.t('cancel')],
                  cancelButtonIndex: groupsList.length,
                },
                (buttonIndex) => {
                  groupsList.find((el, index) => index === buttonIndex) &&
                    setBirthdayGroup(buttonIndex);
                }
              );
            }}
          />
        )}

        {filteredEvents.map((item, index) => {
          const key = index;
          return (
            <EventTile
              key={key}
              index={index}
              item={item}
              updateValue={updateValue}
            />
          );
        })}
      </InputScrollView>
    </View>
  );
};

export default NewItemScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  doneBtn: {
    color: colors.active,
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 16,
  },
  doneBtnDisabled: {
    color: colors.gray,
  },
});
