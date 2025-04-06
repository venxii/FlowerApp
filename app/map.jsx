import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';

export default function MapView() {
  return (
    <WebView
      style={styles.container}
      source={{ uri: `${process.env.EXPO_PUBLIC_SERVER_URL}/enclosed` }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
