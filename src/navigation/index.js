import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";
import RootNavigator from "./RootNavigator";

export default function Navigation() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootNavigator />
    </NavigationContainer>
  );
}
