import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {SafeAreaView, ScrollView, StatusBar, Switch, Text, TouchableOpacity, View} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import { COLOURS, FONT_SIZES, ICON_SIZES, RADIUS, SPACING } from '../../util/GlobalStyles';

export function Setting(): JSX.Element {
  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View
      style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
        flex: 1,
      }}>
      <View 
        style={{
          backgroundColor: COLOURS.grey,
          flexDirection: "column",
          alignSelf: "flex-start",
          margin: SPACING.medium,
          paddingHorizontal: SPACING.medium,
          borderRadius: RADIUS.standard,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "flex-start",
          }}
          onPress={()=>{}}
        >
          <Text style={{
              flex: 1,
              fontSize: FONT_SIZES.medium,
              alignSelf: "center",
              marginVertical: SPACING.small,
            }}
          >Edit Account</Text>
          <MaterialIcons 
            name="arrow-forward-ios" 
            color={COLOURS.black} 
            size={ICON_SIZES.medium} 
            style={{alignSelf: "center",}}
          />
        </TouchableOpacity>
      </View>
      <View 
        style={{
          backgroundColor: COLOURS.grey,
          flexDirection: "column",
          alignSelf: "flex-start",
          margin: SPACING.medium,
          paddingHorizontal: SPACING.medium,
          borderRadius: RADIUS.standard,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "flex-start",
          }}
        >
          <Text style={{
              flex: 1,
              fontSize: FONT_SIZES.medium,
              alignSelf: "center",
              marginVertical: SPACING.small,
            }}
          >Notification</Text>
          <Switch
            style={{
              flex: 1,
              alignSelf: "center"
            }}
          />
        </View>
        <View
          style={{
            borderColor: COLOURS.darkGrey,
            borderBottomWidth: 1,
            alignSelf: "stretch",
          }}
        />
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "flex-start",
          }}
          onPress={()=>{}}
        >
          <Text style={{
              flex: 1,
              fontSize: FONT_SIZES.medium,
              alignSelf: "center",
              marginVertical: SPACING.small,
            }}
          >Theme</Text>
          <MaterialIcons 
            name="arrow-forward-ios" 
            color={COLOURS.black} 
            size={ICON_SIZES.medium} 
            style={{alignSelf: "center",}}
          />
        </TouchableOpacity>
      </View>
      <View 
        style={{
          backgroundColor: COLOURS.grey,
          flexDirection: "column",
          alignSelf: "flex-start",
          margin: SPACING.medium,
          paddingHorizontal: SPACING.medium,
          borderRadius: RADIUS.standard,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "flex-start",
          }}
        >
          <Text style={{
              flex: 1,
              fontSize: FONT_SIZES.medium,
              alignSelf: "center",
              marginVertical: SPACING.small,
            }}
          >Debug Mode</Text>
          <Switch
            style={{
              flex: 1,
              alignSelf: "center"
            }}
          />
        </View>
        <View
          style={{
            borderColor: COLOURS.darkGrey,
            borderBottomWidth: 1,
            alignSelf: "stretch",
          }}
        />
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "flex-start",
          }}
          onPress={()=>{}}
        >
          <Text style={{
              flex: 1,
              fontSize: FONT_SIZES.medium,
              alignSelf: "center",
              marginVertical: SPACING.small,
              color: COLOURS.textTouchable,
            }}
          >Reset</Text>
        </TouchableOpacity>
        <View
          style={{
            borderColor: COLOURS.darkGrey,
            borderBottomWidth: 1,
            alignSelf: "stretch",
          }}
        />
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "flex-start",
          }}
          onPress={()=>{}}
        >
          <Text style={{
              flex: 1,
              fontSize: FONT_SIZES.medium,
              alignSelf: "center",
              marginVertical: SPACING.small,
            }}
          >Help</Text>
          <MaterialIcons 
            name="arrow-forward-ios" 
            color={COLOURS.black} 
            size={ICON_SIZES.medium} 
            style={{alignSelf: "center",}}
          />
        </TouchableOpacity>
        <View
          style={{
            borderColor: COLOURS.darkGrey,
            borderBottomWidth: 1,
            alignSelf: "stretch",
          }}
        />
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "flex-start",
          }}
          onPress={()=>{}}
        >
          <Text style={{
              flex: 1,
              fontSize: FONT_SIZES.medium,
              alignSelf: "center",
              marginVertical: SPACING.small,
            }}
          >About</Text>
          <MaterialIcons 
            name="arrow-forward-ios" 
            color={COLOURS.black} 
            size={ICON_SIZES.medium} 
            style={{alignSelf: "center",}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
