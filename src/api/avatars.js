import axios from 'axios';
import {endpoint} from './endpoints';
import {serverToken} from './tokens';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchAvatars = async (params = {}) => {
  const id = await AsyncStorage.getItem('id');
  return axios({
    url: `${endpoint}/birthday_reminder_avatars`,
    headers: {
      'Content-type': 'application/json',
    },
    params: {...params, secret: serverToken, user_id: id},
    method: 'GET',
  }).then(({data}) => {
    console.log(data);
    return data;
  });
};
