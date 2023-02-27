import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLOURS, FONT_SIZES, RADIUS, SPACING } from "../util/GlobalStyles";

type Props = {
  text: string;
  onPress: () => void;
};

const PrimaryButton = (props: Props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.container}>
      <Text
        style={{
          textAlign: "center",
          color: COLOURS.white,
          fontSize: FONT_SIZES.small,
        }}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOURS.primary,
    borderRadius: RADIUS.standard,
    padding: SPACING.medium,
    flex: 1,
  },
});
