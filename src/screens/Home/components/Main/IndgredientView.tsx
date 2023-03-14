import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { UserDataContext } from "../../../../classes/UserData";
import IngredientCard from "./IngredientCard";
import {
  COLOURS,
  FONT_SIZES,
  RADIUS,
  SPACING,
} from "../../../../util/GlobalStyles";
import { HomeContext } from "../HomeContextProvider";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import {
  Ingredient,
  IngredientBuilder,
} from "../../../../classes/IngredientClass";
import IngredientPopup from "../IngredientPopup";
import NoDataSvg from "../../../../assets/no_data.svg";
import * as DB from "../../../../backends/Database"
import { HomeSortingFilter } from "../Menu/HomeSortingFilters";

type Props = {
  ingredientsSearch: string;
  sort: HomeSortingFilter;
};

const IndgredientView = (props: Props) => {
  const { userData, setUserData } = useContext(UserDataContext);
  const { homeContext, setHomeContext } = useContext(HomeContext);
  const navigation = useNavigation<any>();
  const [ingredientShown, setIngredientShown] = useState<Ingredient | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const [expiredIngredients, setExpiredIngredients] = useState<Ingredient[]>([]);

  const activeFilters = userData.ingredientCategories.filter((i) => i.active);
  const [activeIngredients, setActiveIngredients] = useState<Ingredient[]>([]);

  async function loadFromDB(): Promise<Ingredient[]>{
    const ing: Ingredient[] = []
    for (const v of await DB.readAllIngredient()) {
      ing.push(await v.toIngredientClass());
    }
    return ing
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setLoading(true)
      loadFromDB().then((ing)=>{
        setExpiredIngredients(
          ing.filter(
            (i) => i.expiryDate < new Date() && i.quantity > 0
          )
        );
        setActiveIngredients(
          ing
            .filter((i) => i.expiryDate > new Date() && i.quantity > 0)
            .filter((i) => {
              for (let filter of activeFilters) {
                if (i.categories.filter((v) => v.name == filter.name).length == 0)
                  return false;
              }
              return true;
            })
            .filter((i) => {
              if (props.ingredientsSearch === "") return true;
  
              return i.getName
                .toLowerCase()
                .includes(props.ingredientsSearch.toLowerCase());
            })
        )
        setUserData({
          ...userData,
          storedIngredients: ing
        })
        sortActiveIng()
        console.log("navigation")
        setLoading(false)
      })
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(()=>{
    if (ingredientShown == null){
      setLoading(true)
      console.log("ingredientShown")
      loadFromDB().then((ing)=>{
        setExpiredIngredients(
          ing.filter(
            (i) => i.expiryDate < new Date() && i.quantity > 0
          )
        );
        setActiveIngredients(
          ing
            .filter((i) => i.expiryDate > new Date() && i.quantity > 0)
            .filter((i) => {
              for (let filter of activeFilters) {
                if (i.categories.filter((v) => v.name == filter.name).length == 0)
                  return false;
              }
              return true;
            })
            .filter((i) => {
              if (props.ingredientsSearch === "") return true;
  
              return i.getName
                .toLowerCase()
                .includes(props.ingredientsSearch.toLowerCase());
            })
        )
        setUserData({
          ...userData,
          storedIngredients: ing
        })
        sortActiveIng()
        console.log("navigation")
        setLoading(false)
      })
    }
    
  }, [ingredientShown])

  useEffect(()=>{
    setLoading(true)
    setActiveIngredients(
      userData.storedIngredients
        .filter((i) => i.expiryDate > new Date() && i.quantity > 0)
        .filter((i) => {
          for (let filter of activeFilters) {
            if (i.categories.filter((v) => v.name == filter.name).length == 0)
              return false;
          }
          return true;
        })
        .filter((i) => {
          if (props.ingredientsSearch === "") return true;

          return i.getName
            .toLowerCase()
            .includes(props.ingredientsSearch.toLowerCase());
        })
    )
    sortActiveIng()
    console.log("search")
    setLoading(false)
  }, [props.ingredientsSearch])

  useEffect(()=>{
    setLoading(true)
    sortActiveIng()
    console.log("sort")
    setLoading(false)
  }, [props.sort])

  function sortActiveIng(){
    var newActiveIngredient: Ingredient[] = []
    switch (props.sort) {
      default:
        newActiveIngredient = activeIngredients
        break;
      case HomeSortingFilter.ExpiryDateFirstToLast:
        newActiveIngredient = activeIngredients.sort((a, b) => {
          return a.expiryDate.getTime() - b.expiryDate.getTime();
        })
        break;
      case HomeSortingFilter.ExpiryDateLastToFirst:
        newActiveIngredient = activeIngredients.sort((a, b) => {
          return b.expiryDate.getTime() - a.expiryDate.getTime();
        })
        break;
      case HomeSortingFilter.QuantityLowToHigh:
        newActiveIngredient = activeIngredients.sort((a, b) => {
          return a.quantity - b.quantity;
        })
        break;
      case HomeSortingFilter.QuantityHighToLow:
        newActiveIngredient = activeIngredients.sort((a, b) => {
          return b.quantity - a.quantity;
        })
        break;
    }
  }

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
      <ScrollView
        contentContainerStyle={{
          flexDirection: "column",
          alignItems: "flex-start",
          flex: 1,
        }}
      >
        {loading && <ActivityIndicator
          size={"large"}
          color={COLOURS.primary}
          style={{
            transform: [{ scale: 2 }],
            flex:1,
            alignSelf: "center",
          }}
        />}
        {!loading && expiredIngredients.length > 0 && (
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

        {!loading && getMainIngredients()}
      </ScrollView>
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
