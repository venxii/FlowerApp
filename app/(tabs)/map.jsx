import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';

export default function MapView() {
  const SERVER_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_SERVER_URL || "http://13.60.171.34:8000";

  return (
    <WebView
      style={styles.container}
      source={{ uri: `${SERVER_URL}/enclosed` }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});