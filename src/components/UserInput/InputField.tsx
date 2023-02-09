import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { COLOURS, RADIUS, SPACING } from "../../util/GlobalStyles";

type Props = {
  required?: boolean;
  textHint?: string;
  fieldName: string;
  onTextChange: (text: string) => void;
  width?: number;
  children?: React.ReactNode;
};

const InputField = (props: Props) => {
  return (
    <View>
      <Text>
        {props.fieldName}
        {props.required ? "*" : ""}
      </Text>
      <TextInput
        placeholder={props.textHint ? props.textHint : props.fieldName}
        onChangeText={(value: string) => props.onTextChange(value)}
        style={styles(props).input}
      />
      {props.children}
    </View>
  );
};

export default InputField;

const styles = (props: Props) =>
  StyleSheet.create({
    input: {
      backgroundColor: "white",
      height: 40,
      borderRadius: RADIUS.tiny,
      padding: 10,
      borderColor: COLOURS.darkGrey,
      borderWidth: 1,
      marginTop: SPACING.small,
      width: props.width ? props.width : 200,
    },
  });
