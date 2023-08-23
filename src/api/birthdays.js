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
export const createBirthday = async (params = {}) => {
  const token = await AsyncStorage.getItem('token');
  return axios({
    url: `${endpoint}/birthday_events`,
    headers: {
      'Content-type': 'application/json',
    },
    data: { ...params, secret: serverToken, token },
    method: 'POST',
  }).then(({ data }) => {
    console.log(data);
    return data;
  });
};
export const updateBirthday = async (params = {}) => {
  const token = await AsyncStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-type', 'multipart/form-data');
  return axios({
    url: `${endpoint}/birthday_events/${params.id}`,
    headers,
    data: { ...params, secret: serverToken, token },
    method: 'PUT',
  }).then(({ data }) => {
    console.log(data);
    return data;
  });
};

export const updateImageBirthday = async (params = {}) => {
  const token = await AsyncStorage.getItem('token');
  const data = new FormData();
  data.append('item[image]', {
    uri: params.image,
    name: 'image.jpg',
    type: 'image/jpeg',
  });
  data.append('secret', serverToken);
  data.append('token', token);
  const headers = new Headers();
  headers.append('Content-type', 'multipart/form-data');
  return axios({
    url: `${endpoint}/birthday_reminder_items/${params.id}`,
    headers,
    data,
    method: 'PUT',
  }).then(({ data }) => {
    console.log(data);
    return data;
  });
};

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
