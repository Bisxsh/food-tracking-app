import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import CustomSearchBar from "../../components/CustomSearchBar";
import IngredientsFilter from "../../components/IngredientsFilter";
import { UserDataContext } from "../../classes/UserData";
import SortButton from "../../components/SortButton";

type Props = {
  ingredientsSearch: string;
  setIngredientsSearch: (ingredientsSearch: string) => void;
  sort: number;
  setSort: (sort: number) => void;
  sortFilters: any[];
};

const RecipeMenu = (props: Props) => {
  return (
    <View style={styles.menu}>
      <CustomSearchBar
        textHint="Search stored ingredients"
        text={props.ingredientsSearch}
        setText={props.setIngredientsSearch}
        width={300}
      />
      <SortButton
        options={props.sortFilters}
        selectedOption={props.sort}
        setSelectedOption={props.setSort}
        removeMargin
      />
    </View>
  );
};

export default RecipeMenu;

const styles = StyleSheet.create({
  menu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});
