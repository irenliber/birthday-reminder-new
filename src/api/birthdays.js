import axios from 'axios';
import { endpoint } from './endpoints';
import { serverToken } from './tokens';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchBirthdays = async (params = {}) => {
  const token = await AsyncStorage.getItem('token');

  if (!token) {
    return await fetchBirthdays(params);
  }

  return axios({
    url: `${endpoint}/birthday_events`,
    headers: {
      'Content-type': 'application/json',
    },
    params: { ...params, secret: serverToken, token },
    method: 'GET',
  }).then(({ data }) => {
    return data;
  });
}

export const deleteBirthday = async (params = {}) => {
  const token = await AsyncStorage.getItem('token');
  return axios({
    url: `${endpoint}/birthday_events/${params.eventId}`,
    headers: {
      'Content-type': 'application/json',
    },
    data: { ...params, secret: serverToken, token },
    method: 'DELETE',
  }).then(({ data }) => {
    console.log(data);
    return data;
  });
};
