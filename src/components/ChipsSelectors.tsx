import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import Chips from "./Chips";
import { Category } from "../classes/Categories";
import IngredientsFilter from "./IngredientsFilter";

type Props = {
  fieldName: string;
  required?: boolean;
  categories: Category[];
  setCategories: (list: Category[]) => void;
  onAdd?: (arg: Category) => void; // Function to run when a new category is created
};

const ChipsSelectors = (props: Props) => {
  const [selectedFilters, setSelectedFilters] = React.useState<Category[]>(
    props.categories.filter((cat) => cat.active)
  );

  useEffect(() => {
    setSelectedFilters(props.categories.filter((cat) => cat.active));
  }, [props.categories]);

  return (
    <View style={styles.container}>
      {selectedFilters.map((category, index) => (
        <Chips
          key={`category.name-${index}`}
          text={category.name}
          onClose={() => {
            setSelectedFilters((prev) =>
              prev.filter((cat) => cat.name !== category.name)
            );
            let newCategories = props.categories.map((cat) => {
              if (cat.name === category.name) {
                cat.active = false;
              }
              return cat;
            });
            props.setCategories(newCategories);
          }}
        />
      ))}
      <IngredientsFilter
        options={props.categories}
        setOptions={props.setCategories}
        onAdd={props.onAdd}
        plusSymbol
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
