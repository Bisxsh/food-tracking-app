import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { RADIUS, COLOURS, SPACING } from "../util/GlobalStyles";

type Props = {
  required?: boolean;
  textHint?: string;
  fieldName?: string;
  onTextChange: (text: any) => void;
  width?: number;
  numberInput?: boolean;
  defaultValue?: string;
};

const InputField = (props: Props) => {
  return (
    <View style={{ position: "relative", flex: 1 }}>
      <Text>
        {props.fieldName}
        {props.required ? "*" : ""}
      </Text>
      <TextInput
        placeholder={props.textHint ? props.textHint : props.fieldName}
        onChangeText={(value: string) => props.onTextChange(value)}
        style={styles(props).input}
        keyboardType={props.numberInput ? "numeric" : "default"}
        defaultValue={props.defaultValue}
      ></TextInput>
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
      width: props.width ? props.width : "auto",
    },
  });
