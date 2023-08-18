import axios from 'axios';
import { endpoint } from './endpoints';
import { serverToken } from './tokens';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchGroups = async (params = {}) => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    return await fetchGroups(params);
  }

  return axios({
    url: `${endpoint}/birthday_groups`,
    headers: {
      'Content-type': 'application/json',
    },
    params: { ...params, secret: serverToken, token },
    method: 'GET',
  }).then(({ data }) => {
    return data;
  });
};

export const updateGroup = async (params = {}) => {
  const token = await AsyncStorage.getItem('token');

  return axios({
    url: `${endpoint}/birthday_groups/${params.group.id}`,
    headers: {
      'Content-type': 'application/json',
    },
    data: { ...params, secret: serverToken, token },
    method: 'PATCH',
  }).then(({ data }) => {
    return data;
  });
};

export const createGroup = async (params = {}) => {
  const token = await AsyncStorage.getItem('token');

  return axios({
    url: `${endpoint}/birthday_groups`,
    headers: {
      'Content-type': 'application/json',
    },
    data: { ...params, secret: serverToken, token },
    method: 'POST',
  }).then(({ data }) => {
    return data;
  });
};

export const deleteGroup = async (params = {}) => {
  const token = await AsyncStorage.getItem('token');

  return axios({
    url: `${endpoint}/birthday_groups/${params.group.id}`,
    headers: {
      'Content-type': 'application/json',
    },
    data: { ...params, secret: serverToken, token },
    method: 'DELETE',
  }).then(({ data }) => {
    return data;
  });
};
