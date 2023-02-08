import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";
import { FilterCategory } from "../../classes/FilterCategory";
import AddButton from "../../components/AddButton";
import { SPACING } from "../../util/GlobalStyles";
import IndgredientView from "./components/Main/IndgredientView";
import HomeMenu from "./components/Menu/HomeMenu";
import { HomeSortingFilters } from "./components/Menu/HomeSortingFilters";

export const FiltersContext: React.Context<
  [FilterCategory[], React.Dispatch<React.SetStateAction<FilterCategory[]>>]
> = React.createContext<
  [FilterCategory[], React.Dispatch<React.SetStateAction<FilterCategory[]>>]
>([[], () => {}]);

export function Home(): JSX.Element {
  const isDarkMode = false;
  const [ingredientsSearch, setIngredientsSearch] = useState("");
  const [selectedSort, setSelectedSort] = useState(0);
  const [filters, setFilters] = useState<FilterCategory[]>([]);

  return (
    <FiltersContext.Provider value={[filters, setFilters]}>
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: SPACING.extraLarge,
        }}
      >
        <HomeMenu
          sortFilters={HomeSortingFilters}
          ingredientsSearch={ingredientsSearch}
          sort={selectedSort}
          setIngredientsSearch={setIngredientsSearch}
          setSort={setSelectedSort}
        />
        <IndgredientView />
        <View style={{ flex: 1 }} />
      </View>
      <AddButton onPress={() => {}} />
    </FiltersContext.Provider>
  );
}

const styles = StyleSheet.create({});
