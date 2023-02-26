import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLOURS, FONT_SIZES, RADIUS, SPACING } from "../util/GlobalStyles";

type Props = {
  text: string;
  width?: number;
  onPress: () => void;
};

const SecondaryButton = (props: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Text
        style={{
          textAlign: "center",
          color: COLOURS.primary,
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
