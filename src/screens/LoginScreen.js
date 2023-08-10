import { View, Text } from "react-native";
import { authUser } from "../store/user";
export default function LoginScreen() {
  return (
    <View >
      <Text>Login Screen</Text>
      <Text  onPress={authUser}>
        Login
      </Text>
    </View>
  );
}
