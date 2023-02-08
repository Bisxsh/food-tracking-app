import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLOURS, DROP_SHADOW, RADIUS, SPACING } from "../util/GlobalStyles";

type Props = {
  onPress: () => void;
};

const AddButton = (props: Props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.container}>
      <MaterialCommunityIcons name="plus" size={24} color={COLOURS.white} />
    </TouchableOpacity>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    padding: SPACING.medium,
    bottom: SPACING.medium,
    right: SPACING.medium,
    backgroundColor: COLOURS.primary,
    borderRadius: RADIUS.circle,
    ...DROP_SHADOW,
  },
});
