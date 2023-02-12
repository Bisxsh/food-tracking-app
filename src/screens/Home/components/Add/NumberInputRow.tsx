import { StyleSheet, Text, View } from "react-native";
import React from "react";
import InputField from "../../../../components/InputField";

type Props = {
  onTextChangeLeft: (text: any) => void;
  onTextChangeRight: (text: any) => void;
  fieldNameLeft: string;
  fieldNameRight: string;
  textHintLeft?: string;
  textHintRight?: string;
  defaultValueLeft?: string;
  defaultValueRight?: string;
};

const NumberInputRow = (props: Props) => {
  return (
    <View>
      <View style={styles.inputRow}>
        <InputField
          fieldName={props.fieldNameLeft}
          onTextChange={props.onTextChangeLeft}
          numberInput
          textHint={
            props.textHintLeft ? props.textHintLeft : props.fieldNameLeft
          }
          width={180}
          defaultValue={props.defaultValueLeft}
        />
        <InputField
          fieldName={props.fieldNameRight}
          onTextChange={props.onTextChangeRight}
          numberInput
          textHint={
            props.textHintRight ? props.textHintRight : props.fieldNameRight
          }
          width={180}
          defaultValue={props.defaultValueRight}
        />
      </View>
    </View>
  );
};

export default NumberInputRow;

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
