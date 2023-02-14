import { MaterialIcons } from '@expo/vector-icons';
import React, {useContext, useEffect, useState} from 'react';
import {Button, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import { COLOURS, ICON_SIZES, SPACING } from '../../../util/GlobalStyles';
import { UserContext } from '../../../backends/User';
import { ScreenProp, TabNaviContext } from '../ProfileNavigator';


export function Profile({navigation, route}:ScreenProp): JSX.Element {
  const { user, setUser } = useContext(UserContext);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(user.setting.isDark())
  
  useEffect(
    ()=>{
      const unsubscribe = navigation.addListener("focus", ()=>{
        setIsDarkMode(user.setting.isDark())
      })
      return unsubscribe
    }, 
    [navigation]
  ) 
  
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? Colors.darker : Colors.white,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
        }}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.darker : Colors.white,
            flexDirection: "row",
            justifyContent: "flex-end",
            margin: SPACING.small,
          }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
            }}
            onPress={()=>{
              navigation.navigate("Setting")
            }}
          >
            <MaterialIcons 
              name="settings" 
              color={
                (isDarkMode)?COLOURS.white: COLOURS.black
              } 
              size={ICON_SIZES.medium} 
            />
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
                backgroundColor: isDarkMode ? Colors.darker : Colors.white,
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Text style={{color: (isDarkMode)?COLOURS.white: COLOURS.black }}>This is Profile page</Text>
            </View>
          </ScrollView>
        </View>
        
      </View>
    </SafeAreaView>
  );
}
