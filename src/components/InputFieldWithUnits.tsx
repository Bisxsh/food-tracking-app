import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import InputField from "./InputField";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { COLOURS, RADIUS, SPACING } from "../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  fieldName: string;
  required?: boolean;
  onTextChange: (text: number) => void;
  onUnitChange: (unit: any) => void;
  units: any[]; //List of units from enum
  textWidth?: number;
  maxWidth?: number;
  defaultText?: string;
  defaultUnit?: string;
};

const InputFieldWithUnits = (props: Props) => {
  const [value, setValue] = useState(
    props.defaultUnit || props.units[0]?.toString() || "Select"
  );
  const [items, setItems] = useState(props.units);

  return (
    <View style={[styles.container, { maxWidth: props.maxWidth }]}>
      <InputField
        fieldName={props.fieldName}
        required={props.required}
        onTextChange={props.onTextChange}
        numberInput
        defaultValue={props.defaultText}
      />
      <Menu style={styles.unitContainer}>
        <MenuTrigger style={{ height: 40 , flexDirection:"row"}} >
          <Text>{value}</Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color="black"
            style={styles.arrow}
          />
        </MenuTrigger>
        <MenuOptions>
          {items.map((item) => {
            return (
              <MenuOption
                key={item}
                onSelect={() => {
                  setValue(item.toString());
                  props.onUnitChange(item);
                }}
                text={item.toString()}
                style={styles.menuItem}
              />
            );
          })}
        </MenuOptions>
        
      </Menu>
    </View>
  );
};

export default InputFieldWithUnits;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  unitContainer: {
    flexDirection: "row",
    height: 40,
    backgroundColor: COLOURS.white,
    marginTop: SPACING.medium + 6,
    
    borderRadius: RADIUS.tiny,
    padding: 10,
    borderColor: COLOURS.darkGrey,
    borderWidth: 1,
    position: "relative",
    marginLeft: SPACING.tiny,
  },
  arrow: {
    position: "relative",
  },
  menuItem: {
    padding: SPACING.small,
    marginLeft: SPACING.tiny,
  },
});
