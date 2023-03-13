import { StyleSheet, View } from "react-native";
import React from "react";
import {
  SPACING,
  COLOURS,
  RADIUS,
  DROP_SHADOW,
} from "../util/GlobalStyles";
import FilterButton from "./FilterButton";
import { Category } from "../classes/Categories";

type Props = {
  options: Category[];
  setOptions: (options: Category[]) => void;
  onAdd?: (arg: Category) => void;
  plusSymbol?: boolean;
  center?: boolean;
};

const IngredientsFilter = (props: Props) => {

  return (
    <View>
      <FilterButton
        options={props.options}
        width={216}
        textHint="Search categories"
        onAdd={(props.onAdd == undefined)? ()=>{} : props.onAdd}
        setOptions={props.setOptions}
        plusSymbol={props.plusSymbol}
        center={props.center || false}
      />
    </View>
  );
};

export default IngredientsFilter;

const styles = StyleSheet.create({
  modalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLOURS.white,
    padding: SPACING.medium,
    borderRadius: RADIUS.standard,
    ...DROP_SHADOW,
  },

  textInput: {
    minWidth: 200,
    marginLeft: SPACING.small,
  },

  confirmButton: {
    borderRadius: RADIUS.circle,
    padding: SPACING.small,
  },
});
