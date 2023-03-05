import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Alert, 
  AlertButton,
} from "react-native";
import * as Updates from 'expo-updates';
import * as Notifications from "expo-notifications";

import {
  COLOURS,
  FONT_SIZES,
  ICON_SIZES,
  RADIUS,
  SPACING,
} from "../../../util/GlobalStyles";
import { DEFAULT_USER, User, UserContext } from "../../../backends/User";
import * as DB from "../../../backends/Database";
import { UserSetting } from "../../../backends/UserSetting";
import { ScreenProp, StackParams } from "../ProfileNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Category } from "../../../backends/Category";
import { History } from "../../../backends/Histories";
import { Ingredient } from "../../../backends/Ingredient";
import { Meal } from "../../../backends/Meal";
import { Nutrition } from "../../../backends/Nutrition";
import { SafeAreaView } from "react-native-safe-area-context";
import { DEFAULT_USER_DATA, UserDataContext } from "../../../classes/UserData";
import * as ImageUtil from '../../../util/ImageUtil'


type alertProp = {
  title: string
  desc: string
  buttons: AlertButton[]
  user: User
}

function createAlert(prop: alertProp){
  Alert.alert(
      prop.title,
      prop.desc,
      prop.buttons,
      {cancelable:true, userInterfaceStyle:(prop.user.setting.isDark())?"dark":"light"}
  )
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

const NavigateRow = (
  text: string,
  destination: (keyof StackParams),
  navigation: NativeStackNavigationProp<StackParams, any, undefined>
) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf: "flex-start",
        paddingTop: SPACING.tiny,
        paddingBottom: SPACING.tiny,
      }}
      onPress={async () => {
        navigation.navigate(destination, undefined);
      }}
    >
      <Text
        style={{
          flex: 1,
          fontSize: FONT_SIZES.medium,
          alignSelf: "center",
          marginVertical: SPACING.small,
        }}
      >
        {text}
      </Text>
      <MaterialIcons
        name="arrow-forward-ios"
        color={COLOURS.black}
        size={ICON_SIZES.medium}
        style={{ alignSelf: "center" }}
      />
    </TouchableOpacity>
  );
};

const SwitchRow = (text: string, key: keyof UserSetting, onValueChange?: (value: boolean)=>void) => {
  const { user, setUser } = useContext(UserContext);
  const [value, setValue] = useState<boolean>(user.setting[key] as boolean);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "space-between",
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          flex: 1,
          fontSize: FONT_SIZES.medium,
          alignSelf: "center",
          marginVertical: SPACING.small,
        }}
      >
        {text}
      </Text>
      <Switch
        style={{
          alignSelf: "center",
        }}
        value={value}
        onValueChange={(value) => {
          (user.setting[key] as boolean) = value;
          if (onValueChange != undefined){
            onValueChange(value)
          }
          setUser(user);
          setValue(value);
          DB.updateUser(user);
        }}
      />
    </View>
  );
};

const TouchableRow = (text: string, func: Function) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf: "flex-start",
        paddingTop: SPACING.tiny,
        paddingBottom: SPACING.tiny,
      }}
      onPress={()=>{func()}}
    >
      <Text
        style={{
          flex: 1,
          fontSize: FONT_SIZES.medium,
          alignSelf: "center",
          marginVertical: SPACING.small,
          color: COLOURS.textTouchable,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};



export function Setting({ navigation }: ScreenProp): JSX.Element {
  const { user, setUser } = useContext(UserContext);
  const { userData, setUserData } = useContext(UserDataContext);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(user.setting.isDark());

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsDarkMode(user.setting.isDark());
    });
    return unsubscribe;
  }, [navigation]);

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
        }}
      >
        <View style={styles.container}>
          {NavigateRow("Edit Account", "Account", navigation)}
        </View>
        <View style={styles.container}>
          {SwitchRow(
            "Notification", 
            "notification", 
            (value: boolean)=>{
              if (!value){ 
                Notifications.cancelAllScheduledNotificationsAsync() 
              }else{
                // Send push notification at 10pm GMT every day
                const trigger: Notifications.DailyTriggerInput = {
                  hour: 22, // 10pm GMT
                  minute: 0,
                  //second: 0,
                  repeats: true, // Send notification every day
                };
                
                Notifications.scheduleNotificationAsync({
                  content: {
                    title: "Check your food",
                    body: "You need to check your food that are expiring soon!",
                  },
                  trigger,
                });
              }
            }
          )}
          {HorizontalLine}
          {NavigateRow("Theme", "Theme", navigation)}
        </View>
        <View style={styles.container}>
          {SwitchRow("Debug Mode", "debug")}
          {user.setting.debug && NavigateRow("Debug Window", "Debug", navigation)}
          {HorizontalLine}
          {TouchableRow("Reset", ()=>{
            createAlert({
              title:"Reset This App", 
              desc:"You can reset all settings and delete all data on this app.\n\nThis action cannot be undone.", 
              buttons:[
                {
                  text: "Cancel",
                  style: "cancel"
                },
                {
                  text: "Reset",
                  style: "destructive",
                  onPress: ()=>{
                    if (UserSetting.reloadApp != undefined){
                      Category.reset()
                      History.reset()
                      Ingredient.reset()
                      Meal.reset()
                      Nutrition.reset()
                      User.reset()
                      Notifications.cancelAllScheduledNotificationsAsync()
                      setUser(DEFAULT_USER)
                      setUserData(DEFAULT_USER_DATA)
                      DB.deleteFile().then(()=>{
                        ImageUtil.deleteAllImage().then(()=>{
                          UserSetting.reloadApp!()
                        })
                      })
                    }
                  }
                }
              ],
              user: user
            })
          })}
          {HorizontalLine}
          {NavigateRow("Help", "Help", navigation)}
          {HorizontalLine}
          {NavigateRow("About", "About", navigation)}
        </View>
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
