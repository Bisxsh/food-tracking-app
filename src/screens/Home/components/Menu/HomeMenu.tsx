import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import CustomSearchBar from "../../../../components/CustomSearchBar";
import SortButton from "../../../../components/SortButton";
import IngredientsFilter from "../../../../components/IngredientsFilter";
import { UserDataContext } from "../../../../classes/UserData";
import ExpiringButton from "../Main/ExpiringButton";

type Props = {
  ingredientsSearch: string;
  setIngredientsSearch: (ingredientsSearch: string) => void;
  sort: number;
  setSort: (sort: number) => void;
  sortFilters: any[];
  showExpiringButton?: boolean;
};

const HomeMenu = (props: Props) => {
  const { userData, setUserData } = useContext(UserDataContext);
  return (
    <View style={styles.menu}>
      <CustomSearchBar
        textHint="Search stored ingredients"
        text={props.ingredientsSearch}
        setText={props.setIngredientsSearch}
      />
      <SortButton
        options={props.sortFilters}
        selectedOption={props.sort}
        setSelectedOption={props.setSort}
      />
      <IngredientsFilter
        options={userData.ingredientCategories}
        setOptions={(options) =>
          setUserData({ ...userData, ingredientCategories: options })
        }
      />
      {props.showExpiringButton && <ExpiringButton label="Expiring Soon" />}
    </View>
  );
};

export default HomeMenu;

const styles = StyleSheet.create({
  menu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
