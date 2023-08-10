import { atom } from "nanostores";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const user = atom({ type: null, id: null, token: null });

let token = "token_here"
export async function authUser() {
  await AsyncStorage.setItem("token", token);
  // await AsyncStorage.setItem("type", null);
  await AsyncStorage.setItem("id", "123456789987");
  user.set({ ...user.get(), token: token });
}

export function setUser(params) {
  user.set({ ...user.get(), ...params });
}
