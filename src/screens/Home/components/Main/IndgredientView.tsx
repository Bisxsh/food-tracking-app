import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../../../../classes/UserData";
import IngredientCard from "./IngredientCard";
import { SPACING } from "../../../../util/GlobalStyles";
import { HomeContext } from "../HomeContextProvider";
import { useNavigation } from "@react-navigation/native";
import {
  Ingredient,
  IngredientBuilder,
} from "../../../../classes/IngredientClass";
import IngredientPopup from "../IngredientPopup";

type Props = {};

const IndgredientView = (props: Props) => {
  const { userData, setUserData } = useContext(UserDataContext);
  const { homeContext, setHomeContext } = useContext(HomeContext);
  const navigation = useNavigation<any>();
  const [ingredientShown, setIngredientShown] = useState<Ingredient | null>(
    null
  );

  return (
    <View
      style={[
        styles.container,
        userData.storedIngredients.filter((i) => i.quantity > 0).length > 2
          ? { justifyContent: "center" }
          : {},
      ]}
    >
      {userData.storedIngredients
        .filter((i) => i.quantity > 0)
        .map((ingredient) => (
          <TouchableOpacity
            onPress={() => {
              setIngredientShown(ingredient);
            }}
            key={`${ingredient.getId} - ${ingredient.getName}`}
          >
            <IngredientCard ingredient={ingredient} />
          </TouchableOpacity>
        ))}
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
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: SPACING.small,
  },
});
