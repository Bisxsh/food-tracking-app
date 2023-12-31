import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLOURS, DROP_SHADOW, RADIUS, SPACING } from "../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  text: string;
  onClose?: () => void;
  colour?: string;
};

const Chips = (props: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: props.colour || COLOURS.grey },
      ]}
      onPress={props.onClose}
    >
      <Text>{props.text}</Text>

      <MaterialCommunityIcons
        name="close"
        size={16}
        color="black"
        style={styles.close}
      />
    </TouchableOpacity>
  );
};

export default Chips;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLOURS.grey,
    borderRadius: RADIUS.standard,
    padding: SPACING.small + 2,
    paddingLeft: SPACING.medium,
    paddingRight: SPACING.medium,
    margin: SPACING.tiny,
    alignSelf: "flex-start",
    alignItems: "center",
  },

  close: {
    marginLeft: SPACING.tiny,
  },
});
