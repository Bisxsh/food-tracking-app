import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  AlertButton,
  Image,
  Button,
  Pressable,
  useWindowDimensions,
} from "react-native";

import { User, UserContext, DietReqs } from "../backends/User";
import {
  COLOURS,
  FONT_SIZES,
  ICON_SIZES,
  RADIUS,
  SPACING,
} from "../util/GlobalStyles";
import * as DB from "../backends/Database";
import { getImageSrc } from "../util/ImageUtil";
import {
  ActionSheetOptions,
  useActionSheet,
} from "@expo/react-native-action-sheet";
import Checkbox from "../components/Checkbox";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type selectRowProp = {
  text: string;
  initialVal: boolean;
  onChange: Function;
};

type alertProp = {
  title: string;
  desc: string;
  buttons: AlertButton[];
  user: User;
};

function createAlert(prop: alertProp) {
  Alert.alert(prop.title, prop.desc, prop.buttons, {
    userInterfaceStyle: prop.user.setting.isDark() ? "dark" : "light",
  });
}

async function getPhoto(
  showActionSheetWithOptions: (
    options: ActionSheetOptions,
    callback: (i?: number | undefined) => void | Promise<void>
  ) => void,
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User>>,
  setImg: React.Dispatch<React.SetStateAction<string | undefined>>
) {
  getImageSrc(showActionSheetWithOptions, (uri: string) => {
    setImg(uri);
    user.imgSrc = uri;
    setUser(user);
  });
}

function SelectRow(prop: selectRowProp): JSX.Element {
  const [value, setValue] = useState<boolean>(prop.initialVal);
  return (
    <View
      style={{
        flexDirection: "row",
        paddingVertical: SPACING.small,
        paddingHorizontal: SPACING.medium,
        justifyContent: "flex-start",
      }}
    >
      <Checkbox
        onPress={(arg) => {
          setValue(arg);
          prop.onChange(arg);
        }}
        initialVal={value}
        size={ICON_SIZES.medium}
      />
      <Text
        style={{
          paddingLeft: SPACING.tiny,
          fontSize: FONT_SIZES.medium,
          width: "75%",
        }}
      >
        {prop.text}
      </Text>
    </View>
  );
}

function selectRowOnChange(
  newValue: boolean,
  text: string,
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User>>
) {
  const index = Object.values(DietReqs).findIndex((value) => value == text);
  if (index != -1) {
    user.dietReq[index][1] = newValue;
  }
  setUser(user);
}

type InitialEntryProp = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setConsent: React.Dispatch<React.SetStateAction<boolean>>;
};

export function InitialEntry(prop: InitialEntryProp): JSX.Element {
  const [name, setName] = useState("");
  const [img, setImg] = useState<string | undefined>(undefined);
  const dietReqRows: JSX.Element[] = prop.user.dietReq.map((value, index) => {
    const key = index;
    return (
      <SelectRow
        key={key}
        text={value[0]}
        initialVal={value[1]}
        onChange={(newValue: boolean) =>
          selectRowOnChange(newValue, value[0], prop.user, prop.setUser)
        }
      />
    );
  });
  const isDarkMode = prop.user.setting.isDark();
  const { showActionSheetWithOptions } = useActionSheet();
  const {height, width} = useWindowDimensions()
  return (
    <SafeAreaView
      style={{
          flex: 1,
          backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
      }}
      edges={['left', 'right', 'top']}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
        }}
      >
        <Text
          style={{
            fontSize: FONT_SIZES.heading,
            margin: SPACING.small,
            color: isDarkMode ? COLOURS.white : COLOURS.black,
            textAlign: "center",
          }}
        >
          Welcome
        </Text>
        <ScrollView
          style={{
            backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
            flex: 1,
            alignSelf: "stretch",
          }}
        >
          
          {img != undefined && img != "" && (
            <TouchableOpacity
              onPress={() => {
                getPhoto(
                  showActionSheetWithOptions,
                  prop.user,
                  prop.setUser,
                  setImg
                );
              }}
            >
              <Image
                style={{
                  alignItems: "center",
                  aspectRatio: 1,
                  width: Math.min(height, width)*0.3,
                  justifyContent: "center",
                  alignSelf: "center",
                  borderRadius: 100,
                }}
                source={{ uri: img }}
              />
            </TouchableOpacity>
          )}
          {(img == undefined || img == "") && (
            <View
              style={{
                alignItems: "center",
                backgroundColor: COLOURS.darkGrey,
                aspectRatio: 1,
                width: Math.min(height, width)*0.3,
                justifyContent: "center",
                alignSelf: "center",
                borderRadius: 100,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  getImageSrc(showActionSheetWithOptions, (uri: string) => {
                    setImg(uri);
                    prop.user.imgSrc = uri;
                    prop.setUser(prop.user);
                  });
                }}
              >
                <MaterialIcons
                  name="photo-camera"
                  color={COLOURS.white}
                  size={ICON_SIZES.large}
                  style={{
                    textAlign: "center",
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              flexDirection: "column",
              paddingHorizontal: SPACING.medium,
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZES.medium,
                alignSelf: "flex-start",
                marginTop: SPACING.small,
                marginHorizontal: SPACING.medium,
                color: isDarkMode ? COLOURS.white : COLOURS.black,
              }}
            >
              Name
            </Text>
            <TextInput
              placeholderTextColor="grey"
              style={{
                backgroundColor: COLOURS.grey,
                fontSize: FONT_SIZES.medium,
                marginVertical: SPACING.small,
                paddingVertical: SPACING.small,
                paddingHorizontal: SPACING.medium,
                borderRadius: RADIUS.standard,
                width: "100%",
              }}
              placeholder="Name"
              onChangeText={setName}
              value={name}
              onSubmitEditing={(e) => {
                if (e.nativeEvent.text != "") {
                  prop.user.name = e.nativeEvent.text;
                  prop.setUser(prop.user);
                } else {
                  createAlert({
                    title: "Empty Error",
                    desc: "Name cannot be empty",
                    buttons: [{ text: "OK" }],
                    user: prop.user,
                  });
                }
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "column",
              paddingHorizontal: SPACING.medium,
            }}
          >
            <View
              style={{
                alignSelf: "stretch",
                marginTop: SPACING.small,
                marginHorizontal: SPACING.medium,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: FONT_SIZES.medium,
                  alignSelf: "flex-start",
                  color: isDarkMode ? COLOURS.white : COLOURS.black,
                }}
              >
                Dietary Requirements
              </Text>
            </View>
            <View
              style={{
                backgroundColor: COLOURS.grey,
                flexDirection: "column",
                borderRadius: RADIUS.standard,
                marginVertical: SPACING.small,
                paddingVertical: SPACING.small,
              }}
            >
              {dietReqRows}
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: SPACING.medium,
              marginVertical: SPACING.small,
            }}
          >
            <Checkbox
              onPress={(value) => {
                prop.user.consent = value;
              }}
              initialVal={prop.user.consent}
              size={ICON_SIZES.medium}
            />
            <Text 
              style={{ 
                flexShrink: 1,
                color: isDarkMode? COLOURS.white: COLOURS.black
              }}
            >
              By check this, you are comfirming that your information is stored in
              this app securely, and used only for improving your experience.
            </Text>
          </View>
          <Pressable
            style={styles.pressable}
            onPress={() => {
              if (name.length != 0) {
                if (prop.user.consent) {
                  DB.updateUser(prop.user);
                  prop.setConsent(true);
                  prop.setUser(prop.user);
                } else {
                  createAlert({
                    title: "User Consent Missing",
                    desc: "Please confirm and check the box",
                    buttons: [{ text: "OK" }],
                    user: prop.user,
                  });
                }
              } else {
                createAlert({
                  title: "Name missing",
                  desc: "Name cannot be empty",
                  buttons: [{ text: "OK" }],
                  user: prop.user,
                });
              }
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZES.small,
                color: COLOURS.white,
              }}
            >
              Create Account
            </Text>
          </Pressable>
        </ScrollView>
      </View>
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
  text: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    alignSelf: "center",
    marginVertical: SPACING.small,
  },
  pressable: {
    marginHorizontal: SPACING.medium,
    marginTop: SPACING.small,
    marginBottom: SPACING.large,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.medium,
    borderRadius: RADIUS.tiny,
    elevation: 3,
    backgroundColor: COLOURS.primary,
  },
});
