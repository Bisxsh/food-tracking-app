import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import CustomSearchBar from "../../components/CustomSearchBar";
import SortButton from "../../components/SortButton";
import IngredientsFilter from "../../components/IngredientsFilter";
import { UserDataContext } from "../../classes/UserData";

type Props = {
  ingredientsSearch: string;
  setIngredientsSearch: (ingredientsSearch: string) => void;
  sort: number;
  setSort: (sort: number) => void;
  sortFilters: any[];
};

const HomeMenu = (props: Props) => {
  const { userData, setUserData } = useContext(UserDataContext);
  return (
    <View style={styles.menu}>
      <CustomSearchBar
        textHint="Search stored ingredients"
        text={props.ingredientsSearch}
        setText={props.setIngredientsSearch}
        width={300}
      />
      <IngredientsFilter
        options={userData.ingredientCategories}
        setOptions={(options) =>
          setUserData({ ...userData, ingredientCategories: options })
        }
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
    marginBottom: 10,
  },
});
