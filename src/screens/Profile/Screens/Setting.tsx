import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "react-native/Libraries/NewAppScreen";

import {
  COLOURS,
  FONT_SIZES,
  ICON_SIZES,
  RADIUS,
  SPACING,
} from "../../../util/GlobalStyles";
import { User, UserContext } from "../../../backends/User";
import * as DB from "../../../backends/Database";
import { UserSetting } from "../../../backends/UserSetting";
import { ScreenProp, StackParams } from "../ProfileNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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
  destination: keyof StackParams,
  navigation: NativeStackNavigationProp<StackParams, any, undefined>
) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf: "flex-start",
        paddingTop: SPACING.small,
        paddingBottom: SPACING.small,
      }}
      onPress={async () => {
        navigation.navigate(destination);
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

const SwitchRow = (text: string, key: keyof UserSetting) => {
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
        paddingTop: SPACING.small,
        paddingBottom: SPACING.small,
      }}
      onPress={func()}
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(user.setting.isDark());

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsDarkMode(user.setting.isDark());
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView
      style={{
        backgroundColor: isDarkMode ? Colors.darker : Colors.white,
        flex: 1,
      }}
    >
      <View style={styles.container}>
        {NavigateRow("Edit Account", "Account", navigation)}
      </View>
      <View style={styles.container}>
        {SwitchRow("Notification", "notification")}
        {HorizontalLine}
        {NavigateRow("Theme", "Theme", navigation)}
      </View>
      <View style={styles.container}>
        {SwitchRow("Debug Mode", "debug")}
        {user.setting.debug && NavigateRow("Debug Window", "Debug", navigation)}
        {HorizontalLine}
        {TouchableRow("Reset", () => {})}
        {HorizontalLine}
        {NavigateRow("Help", "Help", navigation)}
        {HorizontalLine}
        {NavigateRow("About", "About", navigation)}
      </View>
    </ScrollView>
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
