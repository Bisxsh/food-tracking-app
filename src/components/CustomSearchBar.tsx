import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLOURS, RADIUS, SPACING } from "../util/GlobalStyles";

type Props = {
  textHint: string;
  text: string; // From useState
  setText: (text: string) => void; // From useState
  width?: number;
  height?: number;
};

const CustomSearchBar = (props: Props) => {
  return (
    <View style={styles(props).container}>
      <TextInput
        placeholder={props.textHint}
        onChangeText={(value: string) => props.setText(value)}
      />
      <MaterialCommunityIcons
        name="magnify"
        size={24}
        color="black"
        style={{ marginLeft: SPACING.small }}
      />
    </View>
  );
};

export default CustomSearchBar;

const styles = (props: Props) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: COLOURS.grey,
      width: props.width ? props.width : "auto",
      alignSelf: "stretch",
      height: props.height ? props.height : "auto",
      marginLeft: SPACING.small,
      marginRight: SPACING.medium,
      padding: SPACING.small,
      paddingLeft: SPACING.medium,
      paddingRight: SPACING.medium,
      borderRadius: RADIUS.standard,
      flex: 1,
    },
  });
