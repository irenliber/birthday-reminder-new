import { View, Text, StyleSheet } from "react-native";

export default function CardsScreen() {
  return (
    <View style={styles.container}>
      <Text>Cards screen</Text>
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
