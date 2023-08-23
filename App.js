import Navigation from "./src/navigation"
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

export default function App() {
  return (
    <ActionSheetProvider>
      <Navigation />
    </ActionSheetProvider>
  );
}
