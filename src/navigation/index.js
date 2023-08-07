import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";
import TabNavigator from "./TabNavigator";

export default function Navigation() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <TabNavigator />
    </NavigationContainer>
  );
}
