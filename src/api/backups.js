import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { endpoint } from './endpoints';
import { serverToken } from './tokens';

export const createBackup = async (params = {}) => {
  const token = await AsyncStorage.getItem('token');
  return axios({
    url: `${endpoint}/birthday_backups`,
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

export const getBackup = async (params = {}) => {
  const token = await AsyncStorage.getItem('token');
  return axios({
    url: `${endpoint}/birthday_backups/${params.id}`,
    headers: {
      'Content-type': 'application/json',
    },
    params: { ...params, secret: serverToken, token },
    method: 'get',
  }).then(({ data }) => {
    console.log(data);
    return data;
  });
};

export const fillBackup = async (params = {}) => {
  const token = await AsyncStorage.getItem('token');
  return axios({
    url: `${endpoint}/birthday_backups/${params.id}/fill`,
    headers: {
      'Content-type': 'application/json',
    },
    params: { ...params, secret: serverToken, token },
    method: 'post',
  }).then(({ data }) => {
    console.log(data);
    return data;
  });
};
