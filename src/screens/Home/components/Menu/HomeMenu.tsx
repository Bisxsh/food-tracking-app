import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomSearchBar from "../../../../components/CustomSearchBar";
import SortButton from "../../../../components/SortButton";
import IngredientsFilter from "./IngredientsFilter";

type Props = {
  ingredientsSearch: string;
  setIngredientsSearch: (ingredientsSearch: string) => void;
  sort: number;
  setSort: (sort: number) => void;
  sortFilters: any[];
};

const HomeMenu = (props: Props) => {
  return (
    <View style={styles.menu}>
      <CustomSearchBar
        textHint="Search stored ingredients"
        text={props.ingredientsSearch}
        setText={props.setIngredientsSearch}
        width={250}
      />
      <SortButton
        options={props.sortFilters}
        selectedOption={props.sort}
        setSelectedOption={props.setSort}
        width={216}
      />
      <IngredientsFilter />
    </View>
  );
};

export default HomeMenu;

const styles = StyleSheet.create({
  menu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
