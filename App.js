import Navigation from "./src/navigation"
import { StatusBar } from 'expo-status-bar';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

export default function App() {
  return (
    <>
      <ActionSheetProvider>
        <Navigation />
      </ActionSheetProvider>
      <StatusBar style="auto" />
    </>
  );
}
