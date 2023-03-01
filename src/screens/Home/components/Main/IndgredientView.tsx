import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../../../../classes/UserData";
import IngredientCard from "./IngredientCard";
import { COLOURS, FONT_SIZES, SPACING } from "../../../../util/GlobalStyles";
import { HomeContext } from "../HomeContextProvider";
import { useNavigation } from "@react-navigation/native";
import {
  Ingredient,
  IngredientBuilder,
} from "../../../../classes/IngredientClass";
import IngredientPopup from "../IngredientPopup";

type Props = {
  ingredientsSearch: string;
};

const IndgredientView = (props: Props) => {
  const { userData, setUserData } = useContext(UserDataContext);
  const { homeContext, setHomeContext } = useContext(HomeContext);
  const navigation = useNavigation<any>();
  const [ingredientShown, setIngredientShown] = useState<Ingredient | null>(
    null
  );

  const expiredIngredients = userData.storedIngredients.filter(
    (i) => i.expiryDate < new Date() && i.quantity > 0
  );

  const activeFilters = userData.ingredientCategories.filter((i) => i.active);

  const activeIngredients = userData.storedIngredients
    .filter((i) => i.expiryDate > new Date() && i.quantity > 0)
    .filter((i) => {
      for (let filter of activeFilters) {
        if (!i.categories.includes(filter)) return false;
      }
      return true;
    })
    .filter((i) => {
      if (props.ingredientsSearch === "") return true;

      return i.getName
        .toLowerCase()
        .includes(props.ingredientsSearch.toLowerCase());
    });

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        flex: 1,
        paddingTop: SPACING.medium,
      }}
    >
      {expiredIngredients.length > 0 && (
        <>
          <View
            style={{
              marginTop: SPACING.small,
              width: "100%",
            }}
          >
            <View
              style={[
                styles.container,
                expiredIngredients.length > 2
                  ? { justifyContent: "center" }
                  : {},
              ]}
            >
              {expiredIngredients.map((ingredient) => (
                <TouchableOpacity
                  onPress={() => {
                    setIngredientShown(ingredient);
                  }}
                  key={`${ingredient.getId} - ${ingredient.getName}`}
                >
                  <IngredientCard ingredient={ingredient} />
                </TouchableOpacity>
              ))}
            </View>
            <View
              style={{
                borderBottomColor: COLOURS.darkGrey,
                borderBottomWidth: StyleSheet.hairlineWidth,
                alignSelf: "stretch",
                marginVertical: SPACING.medium,
              }}
            />
          </View>
        </>
      )}

      <View
        style={[
          styles.container,
          activeIngredients.length > 2 ? { justifyContent: "center" } : {},
        ]}
      >
        {activeIngredients.map((ingredient) => (
          <TouchableOpacity
            onPress={() => {
              setIngredientShown(ingredient);
            }}
            key={`${ingredient.getId} - ${ingredient.getName}`}
          >
            <IngredientCard ingredient={ingredient} />
          </TouchableOpacity>
        ))}
      </View>
      {ingredientShown && (
        <IngredientPopup
          showModal={true}
          setShowModal={(show) => setIngredientShown(null)}
          ingredient={ingredientShown}
        />
      )}
    </View>
  );
};

export default IndgredientView;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
});
