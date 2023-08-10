import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import TabNavigator from "./TabNavigator";
import RootNavigator from "./RootNavigator";

import { useStore } from "@nanostores/react";
import { setUser, user } from "../store/user";
import { SplashScreen } from "../screens";

export default function Navigation() {
  const { token } = useStore(user);

  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    const id = await AsyncStorage.getItem('id');
    const token = await AsyncStorage.getItem('token');
    if (id && token) setUser({ id, token});
    setLoading(false);
  }

  useEffect(() => {
    getUserData();
  }, [])

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {token ? <TabNavigator /> : <RootNavigator />}
    </NavigationContainer>
  );
}
