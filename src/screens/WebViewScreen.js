import React, { useLayoutEffect } from 'react';
import { WebView } from 'react-native-webview';

const WebViewScreen = ({ navigation, route: { params } }) => {
  const { title, uri } = params;
  useLayoutEffect(() => {
    navigation.setOptions({
      title,
    });
  });
  return <WebView source={{ uri }} startInLoadingState />;
};

export default WebViewScreen;
