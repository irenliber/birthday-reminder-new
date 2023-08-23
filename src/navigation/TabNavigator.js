import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from "@react-navigation/native-stack";

import {
  BirthdaysScreen,
  CalendarScreen,
  CardsScreen,
  GroupsScreen,
  EventScreen,
  NewItemScreen,
  NewReminderScreen,
  NoteScreen,
  RemindersScreen,
  SettingsScreen,
  ShareListScreen,
  WebViewScreen,
} from "../screens";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import Ionicons from "@expo/vector-icons/Ionicons";

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Birthdays"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" color={color} size={25} />
          ),
        }}
        component={BirthdaysScreen}
      />
      <Tab.Screen
        name="Calendar"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" color={color} size={25} />
          ),
        }}
        component={CalendarScreen}
      />
      <Tab.Screen
        name="Cards"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="images-outline" color={color} size={25} />
          ),
        }}
        component={CardsScreen}
      />
      <Tab.Screen
        name="Settings"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" color={color} size={25} />
          ),
        }}
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Tabs} />
      <Stack.Screen name="Groups" component={GroupsScreen} />
      <Stack.Screen name="Event" component={EventScreen} />
      <Stack.Screen name="Note" component={NoteScreen} />
      <Stack.Screen name="NewItem" component={NewItemScreen} />
      <Stack.Screen name="Reminders" component={RemindersScreen} />
      <Stack.Screen name="NewReminder" component={NewReminderScreen} />
      <Stack.Screen name="ShareList" component={ShareListScreen} />
      <Stack.Screen name="WebView" component={WebViewScreen} />
    </Stack.Navigator>
  );
}
