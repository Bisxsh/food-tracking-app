import { MaterialIcons } from '@expo/vector-icons';
import React, {useContext, useEffect, useState} from 'react';
import {Button, Text, View, ScrollView, TouchableOpacity, Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import { COLOURS, FONT_SIZES, ICON_SIZES, SPACING } from '../../../util/GlobalStyles';
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
        <ScrollView
          style={{
            flex: 1,
            alignSelf: "stretch",
            flexDirection: "column",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: SPACING.medium,
            }}
          >
            {user.imgSrc != undefined && <Image
                style={{
                    alignItems: "center",
                    aspectRatio: 1,
                    width: "30%",
                    justifyContent: "center",
                    alignSelf: "center",
                    borderRadius: 100
                }}
                source={{uri: user.imgSrc}}
            />}
            {user.imgSrc == undefined && <View
                style={{
                    alignItems: "center",
                    backgroundColor: COLOURS.darkGrey,
                    aspectRatio: 1,
                    width: "30%",
                    justifyContent: "center",
                    alignSelf: "center",
                    borderRadius: 100
                }}
            >
              <Text
                style={{
                  color: COLOURS.white,
                  fontSize: FONT_SIZES.heading
                }}
              >{user.name.charAt(0)}</Text>
            </View>}
            <View
              style={{
                flex: 1,
                flexDirection:"column",
                paddingHorizontal:SPACING.medium,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: isDarkMode ? COLOURS.white : COLOURS.black,
                  fontSize: FONT_SIZES.body
                }}
              >{user.name}</Text>
              <Text
                style={{
                  color: isDarkMode ? COLOURS.white : COLOURS.black,
                  fontSize: FONT_SIZES.small
                }}
              >Saving food since {user.dateOfReg.toLocaleDateString()}</Text>
            </View>
          </View>
        </ScrollView> 
      </View>
    </SafeAreaView>
  );
}
