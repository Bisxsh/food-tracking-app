import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLOURS, DROP_SHADOW, RADIUS, SPACING } from "../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  text: string;
  onClose?: () => void;
};

const Chips = (props: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onClose}>
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
    padding: SPACING.small,
    paddingLeft: SPACING.medium,
    paddingRight: SPACING.medium,
    margin: SPACING.tiny,
    alignSelf: "flex-start",
  },

  close: {
    marginLeft: SPACING.tiny,
  },
});
