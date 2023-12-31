import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useRef } from "react";
import CustomSearchBar from "../../../../components/CustomSearchBar";
import SortButton from "../../../../components/SortButton";
import IngredientsFilter from "../../../../components/IngredientsFilter";
import { UserDataContext } from "../../../../classes/UserData";
import ExpiringButton from "../Main/ExpiringButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { SPACING } from "../../../../util/GlobalStyles";

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
  const resetOption = useRef(true)
  if (resetOption.current){
    userData.ingredientCategories.forEach((v)=>v.active=false)
    resetOption.current = false
  }

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
    paddingHorizontal: SPACING.medium,
  },
});
