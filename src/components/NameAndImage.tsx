import { StyleSheet, Text, View } from "react-native";
import React from "react";

import InputField from "./InputField";
import { MaterialIcons } from "@expo/vector-icons";
import { COLOURS, SPACING } from "../util/GlobalStyles";

type Props = {
  onImgChange: (img: string) => void;
  onNameChange: (name: string) => void;
};

const NameAndImage = (props: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.camera}>
        <MaterialIcons name="camera-alt" size={24} color="black" />
      </View>
      <InputField
        fieldName="Name"
        required
        onTextChange={(str) => props.onNameChange(str)}
      />
    </View>
  );
};

export default NameAndImage;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  camera: {
    aspectRatio: 1,
    backgroundColor: COLOURS.grey,
    width: 80,
    marginRight: SPACING.small,
    justifyContent: "center",
    alignItems: "center",
  },
});
