import { MaterialIcons } from '@expo/vector-icons';
import React, {useContext, useEffect, useState} from 'react';
import {FlatList, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import { COLOURS, FONT_SIZES, ICON_SIZES, RADIUS, SPACING } from '../../../util/GlobalStyles';
import { User, UserContext } from '../../../backends/User';
import * as DB from '../../../backends/Database';
import { Appearance, UserSetting } from '../../../backends/UserSetting';
import { ScreenProp, TabNaviContext } from '../ProfileNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';


type ItemProp = {
  text: string
  index: number
  selected: boolean
  func: Function
}


const HorizontalLine = (
  <View
    style={{
      borderColor: COLOURS.darkGrey,
      borderBottomWidth: 1,
      alignSelf: "stretch",
    }}
  />
);

const TouchableItem = (prop: ItemProp)=>{
    return (
        <TouchableOpacity
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignSelf: "flex-start",
            }}
            onPress={()=>{prop.func(prop.index)}}
            key={prop.index}
        >
            <Text style={{
                flex: 1,
                fontSize: FONT_SIZES.medium,
                alignSelf: "center",
                marginVertical: SPACING.small,
                }}
            >{prop.text}</Text>
            {prop.selected && <MaterialIcons 
                name="check" 
                color={COLOURS.black} 
                size={ICON_SIZES.medium} 
                style={{alignSelf: "center",}}
            />}
        </TouchableOpacity>
    );
}

const TouchableSelector = (texts: string[], func: Function, defaultIndex: number)=>{
    const [value, setValue] = useState<number>(defaultIndex)

    return (
        <View
            style={styles.container}
        >
            {texts.map((text, index)=>(
                  <View style={{alignSelf: "flex-start"}}>
                    <TouchableItem
                      key={index}
                      text={text}
                      index={index}
                      func={()=>{
                          func(index)
                          setValue(index)
                      }}
                      selected={index == value}
                    />
                    {(index < texts.length -1) && HorizontalLine}
                  </View>
            ))}
        </View>
    )
}

export function Theme({navigation}: ScreenProp): JSX.Element {
  const { user, setUser } = useContext(UserContext);
  const { tabNavi, setTabNavi } = useContext(TabNaviContext)
  var isDarkMode = user.setting.isDark()

  return (
    <SafeAreaView
      style={{
          flex: 1,
          backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
      }}
      edges={['left', 'right']}
    >
      <ScrollView
        style={{
          backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
          flex: 1,
        }}>
          {TouchableSelector(
              Object.values(Appearance), 
              (index: number)=>{
                  user.setting.appearance = index
                  setUser(user)
                  DB.updateUser(user)
                  isDarkMode = user.setting.isDark()
                  tabNavi?.setOptions({
                    tabBarStyle: {
                      backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white
                    }
                  })
                  navigation.setOptions({
                    headerStyle: {
                        backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
                    },
                    headerTintColor: isDarkMode ? COLOURS.white : COLOURS.black,
                  })
              },
              user.setting.appearance
          )}
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOURS.grey,
    flexDirection: "column",
    alignSelf: "flex-start",
    margin: SPACING.medium,
    paddingHorizontal: SPACING.medium,
    borderRadius: RADIUS.standard,
  },
});