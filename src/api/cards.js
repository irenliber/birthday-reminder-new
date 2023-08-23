import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { endpoint } from './endpoints';
import { serverToken } from './tokens';

export const fetchCards = async (params = {}) => {
  const token = await AsyncStorage.getItem('token');

  return axios({
    url: `${endpoint}/birthday_cards`,
    headers: {
      'Content-type': 'application/json',
    },
    params: { ...params, secret: serverToken, token },
    method: 'GET',
  }).then(({ data }) => {
    return data;
  });
};
