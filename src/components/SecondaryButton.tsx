import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLOURS, FONT_SIZES, RADIUS, SPACING } from "../util/GlobalStyles";

type Props = {
  text: string;
  width?: number;
  onPress: () => void;
  colour?: string;
};

const SecondaryButton = (props: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        props.colour ? { borderColor: props.colour } : {},
      ]}
      onPress={props.onPress}
    >
      <Text
        style={{
          textAlign: "center",
          color: props.colour || COLOURS.primary,
          fontSize: FONT_SIZES.small,
        }}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

export default SecondaryButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOURS.white,
    borderColor: COLOURS.primary,
    borderWidth: 1,
    borderRadius: RADIUS.standard,
    padding: SPACING.medium,
    flex: 1,
  },
});
