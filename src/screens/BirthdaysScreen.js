import { View, Text, StyleSheet } from "react-native";

export default function BirthdaysScreen() {
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
      <Text>Home screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
