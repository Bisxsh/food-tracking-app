import { MaterialIcons } from '@expo/vector-icons';
import React, {useState} from 'react';
import {Button, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import * as DB from '../../../backends/Database'
import { Ingredient } from '../../../backends/Ingredient';
import { Nutrition } from '../../../backends/Nutrition';
import { COLOURS, ICON_SIZES, SPACING } from '../../../util/GlobalStyles';


export function Profile(): JSX.Element {
  const navigation = useNavigation<any>();
  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
        }}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            flexDirection: "row",
            justifyContent: "flex-end",
            margin: SPACING.small,
          }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
            }}
            onPress={()=>{
              navigation.navigate("Setting", {})
            }}
          >
            <MaterialIcons name="settings" color={COLOURS.black} size={ICON_SIZES.medium} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "stretch",
            alignContent: "center",
          }}
        >
          <ScrollView
            style={{
              flexDirection: "column",
            }}
            contentContainerStyle={{
              flexGrow: 1
            }}
          >
            <View
              style={{
                backgroundColor: isDarkMode ? Colors.black : Colors.white,
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Text>This is Profile page</Text>
            </View>
          </ScrollView>
        </View>
        
      </View>
    </SafeAreaView>
  );
}
