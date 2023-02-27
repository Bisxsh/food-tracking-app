import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Chips from "./Chips";
import { Category } from "../classes/Categories";
import IngredientsFilter from "./IngredientsFilter";
import { COLOURS, SPACING } from "../util/GlobalStyles";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { UserContext } from "../backends/User";

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

  const { user, setUser } = useContext(UserContext);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(user.setting.isDark());

  return (
    <>
      <Text
        style={{
          marginBottom: SPACING.small,
          color: isDarkMode ? Colors.white : COLOURS.black,
        }}
      >
        {props.fieldName}
      </Text>
      <View style={styles.container}>
        {selectedFilters.map((category, index) => (
          <Chips
            key={`category.name-${index}`}
            text={category.name}
            colour={category.colour}
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
    </>
  );
};

export default ChipsSelectors;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
});
