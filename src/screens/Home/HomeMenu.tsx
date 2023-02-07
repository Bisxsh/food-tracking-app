import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomSearchBar from "../../components/CustomSearchBar";
import SortButton from "../../components/SortButton";
import FilterButton from "../../components/FilterButton";

type Props = {
  ingredientsSearch: string;
  setIngredientsSearch: (ingredientsSearch: string) => void;
  selectedFilter: number;
  setSelectedFilter: (selectedFilter: number) => void;
  filters: any[];
};

const HomeMenu = (props: Props) => {
  return (
    <View style={styles.menu}>
      <Text>{props.ingredientsSearch}</Text>
      <CustomSearchBar
        textHint="Search stored ingredients"
        text={props.ingredientsSearch}
        setText={props.setIngredientsSearch}
      />
      <SortButton
        options={props.filters}
        selectedOption={props.selectedFilter}
        setSelectedOption={props.setSelectedFilter}
        width={216}
      />
      <FilterButton
        options={props.filters}
        width={216}
        textHint="Search categories"
      />
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
