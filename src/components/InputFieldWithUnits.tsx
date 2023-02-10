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
};

const InputFieldWithUnits = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(props.units[0]?.toString() || "Select");
  const [items, setItems] = useState(props.units);

  return (
    <View style={[styles.container, { maxWidth: props.maxWidth }]}>
      <InputField
        fieldName={props.fieldName}
        required={props.required}
        onTextChange={props.onTextChange}
        width={props.textWidth}
        numberInput
      />
      <Menu style={styles.unitContainer}>
        <MenuTrigger text={value} style={{ height: 40 }} />
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
        <MaterialCommunityIcons
          name="chevron-down"
          size={24}
          color="black"
          style={styles.arrow}
        />
      </Menu>
    </View>
  );
};

export default InputFieldWithUnits;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  unitContainer: {
    flex: 1,
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
    position: "absolute",
    right: SPACING.small,
    top: 6,
  },
  menuItem: {
    padding: SPACING.small,
    marginLeft: SPACING.tiny,
  },
});
