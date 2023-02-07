import React from 'react';
import {SafeAreaView, ScrollView, StatusBar, Text, View} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

export function Recipe(): JSX.Element {
  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View
      style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}>
      <Text>This is Profile page</Text>
    </View>
  );
}
