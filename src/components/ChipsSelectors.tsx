import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Chips from "./Chips";
import { Category } from "../classes/Categories";
import IngredientsFilter from "./IngredientsFilter";

type Props = {
  fieldName: string;
  required?: boolean;
  categories: Category[];
  setCategories: (list: Category[]) => void;
  onAdd?: (arg: Category) => void;
};

const ChipsSelectors = (props: Props) => {
  return (
    <View style={styles.container}>
      <IngredientsFilter
        options={props.categories}
        setOptions={props.setCategories}
        onAdd={props.onAdd}
      />
    </View>
  );
};

export default ChipsSelectors;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
