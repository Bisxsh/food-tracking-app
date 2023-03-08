import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../../../../classes/UserData";
import IngredientCard from "./IngredientCard";
import {
  COLOURS,
  FONT_SIZES,
  RADIUS,
  SPACING,
} from "../../../../util/GlobalStyles";
import { HomeContext } from "../HomeContextProvider";
import { useNavigation } from "@react-navigation/native";
import {
  Ingredient,
  IngredientBuilder,
} from "../../../../classes/IngredientClass";
import IngredientPopup from "../IngredientPopup";
import NoDataSvg from "../../../../assets/no_data.svg";

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

  function getIngredientCards(ingredients: Ingredient[]) {
    const cards = ingredients.map((ingredient) => (
      <TouchableOpacity
        onPress={() => {
          setIngredientShown(ingredient);
        }}
        key={`${ingredient.getId} - ${ingredient.getName}`}
      >
        <IngredientCard ingredient={ingredient} />
      </TouchableOpacity>
    ));
    if (cards.length > 0 && cards.length % 3 !== 0) {
      for (let i = 0; i < cards.length % 3; i++) {
        cards.push(<View style={styles.dummyCard} />);
      }
    }
    return cards;
  }

  function getMainIngredients() {
    if (activeIngredients.length > 0)
      return (
        <View style={[styles.container]}>
          {getIngredientCards(activeIngredients)}
        </View>
      );

    const message =
      activeFilters.length === 0 && props.ingredientsSearch === ""
        ? "You don't have any stored ingredients! \n Add some by clicking the plus button below!"
        : "You don't have any ingredients that \n match the search criteria 😢";

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginTop: SPACING.medium,
        }}
      >
        <NoDataSvg
          width={200}
          height={200}
          style={{ marginBottom: SPACING.medium }}
        />
        <Text
          style={{
            textAlign: "center",
            fontSize: FONT_SIZES.small,
          }}
        >
          {message}
        </Text>
      </View>
    );
  }

  return (
    <>
      <View
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
          flex: 1,
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
              <View style={[styles.container]}>
                {getIngredientCards(expiredIngredients)}
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

        {getMainIngredients()}
      </View>
      {ingredientShown && (
        <IngredientPopup
          showModal={true}
          setShowModal={(show) => setIngredientShown(null)}
          ingredient={ingredientShown}
        />
      )}
    </>
  );
};

export default IndgredientView;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  dummyCard: {
    width: Dimensions.get("screen").width / 3 - SPACING.medium * 2,
    height: Dimensions.get("screen").width / 3 - SPACING.medium * 2,
    position: "relative",
    aspectRatio: 1,
    margin: SPACING.small,
    justifyContent: "center",
    borderRadius: RADIUS.standard,
  },
});
