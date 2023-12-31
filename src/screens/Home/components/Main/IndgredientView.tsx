import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
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
import * as DB from "../../../../backends/Database";
import { HomeSortingFilter } from "../Menu/HomeSortingFilters";
import { UserContext } from "../../../../backends/User";

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
  const { user, setUser } = useContext(UserContext);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(user.setting.isDark());

  const [expiredIngredients, setExpiredIngredients] = useState<Ingredient[]>(
    []
  );

  const activeFilters = userData.ingredientCategories.filter((i) => i.active);
  const [activeIngredients, setActiveIngredients] = useState<Ingredient[]>([]);
  const {height, width} = useWindowDimensions();

  async function loadFromDB(): Promise<Ingredient[]> {
    const ing: Ingredient[] = [];
    for (const v of await DB.readAllIngredient()) {
      ing.push(await v.toIngredientClass());
    }
    return ing;
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setLoading(true);
      loadFromDB().then((ing) => {
        sortActiveIng(ing);
        setExpiredIngredients(
          ing.filter((i) => i.expiryDate < new Date() && i.quantity > 0)
        );
        setActiveIngredients(
          ing
            .filter((i) => i.expiryDate > new Date() && i.quantity > 0)
            .filter((i) => {
              for (let filter of activeFilters) {
                if (
                  i.categories.filter((v) => v.name == filter.name).length == 0
                )
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
        );
        setUserData({
          ...userData,
          storedIngredients: ing,
        });
        sortActiveIng();
        console.log("navigation");
        setLoading(false);
      });
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (ingredientShown == null) {
      setLoading(true);
      console.log("ingredientShown");
      loadFromDB().then((ing) => {
        setExpiredIngredients(
          ing.filter((i) => i.expiryDate < new Date() && i.quantity > 0)
        );
        setActiveIngredients(
          ing
            .filter((i) => i.expiryDate > new Date() && i.quantity > 0)
            .filter((i) => {
              for (let filter of activeFilters) {
                if (
                  i.categories.filter((v) => v.name == filter.name).length == 0
                )
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
        );
        setUserData({
          ...userData,
          storedIngredients: ing,
        });
        sortActiveIng();
        console.log("navigation");
        setLoading(false);
      });
    }
  }, [ingredientShown]);

  useEffect(() => {
    setLoading(true);
    setActiveIng();
    console.log("search");
    setLoading(false);
  }, [props.ingredientsSearch]);

  useEffect(() => {
    setLoading(true);
    setActiveIng();
    console.log("category");
    setLoading(false);
  }, [userData.ingredientCategories]);

  useEffect(() => {
    setLoading(true);
    sortActiveIng();
    console.log("sort");
    setLoading(false);
  }, [props.sort]);

  function sortActiveIng(list?: Ingredient[]) {
    var newActiveIngredient: Ingredient[] = [];
    switch (props.sort) {
      default:
        newActiveIngredient = activeIngredients;
        break;
      case HomeSortingFilter.ExpiryDateFirstToLast:
        newActiveIngredient = (
          list == undefined ? activeIngredients : list
        ).sort((a, b) => {
          return a.expiryDate.getTime() - b.expiryDate.getTime();
        });
        break;
      case HomeSortingFilter.ExpiryDateLastToFirst:
        newActiveIngredient = (
          list == undefined ? activeIngredients : list
        ).sort((a, b) => {
          return b.expiryDate.getTime() - a.expiryDate.getTime();
        });
        break;
      case HomeSortingFilter.QuantityLowToHigh:
        newActiveIngredient = (
          list == undefined ? activeIngredients : list
        ).sort((a, b) => {
          return a.quantity - b.quantity;
        });
        break;
      case HomeSortingFilter.QuantityHighToLow:
        newActiveIngredient = (
          list == undefined ? activeIngredients : list
        ).sort((a, b) => {
          return b.quantity - a.quantity;
        });
        break;
    }
    //setActiveIngredients(newActiveIngredient);
  }

  function setActiveIng() {
    const newActive: Ingredient[] = userData.storedIngredients
      .filter((i) => i.expiryDate > new Date() && i.quantity > 0)
      .filter((i) => {
        let cats = i.categories.map((i) => i.name);
        for (let filter of activeFilters) {
          if (!cats.includes(filter.name)) return false;
        }
        return true;
      })
      .filter((i) => {
        if (props.ingredientsSearch === "") return true;

        return i.getName
          .toLowerCase()
          .includes(props.ingredientsSearch.toLowerCase());
      });
    sortActiveIng(newActive);
    setActiveIngredients(newActive);
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

  function getMainIngredients(height: number, width: number) {
    
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
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginTop: SPACING.medium,
        }}
      >
        <NoDataSvg
          width={Math.min(height, width)/2}
          height={Math.min(height, width)/2}
          style={{ marginBottom: SPACING.medium }}
        />
        <Text
          style={{
            textAlign: "center",
            fontSize: FONT_SIZES.small,
            color: isDarkMode ? COLOURS.white : COLOURS.black,
          }}
        >
          {message}
        </Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={{
          flex: 1
        }}
        contentContainerStyle={{
          flexDirection: "column",
          alignItems: loading? "center": "flex-start",
          justifyContent: loading? "center": "flex-start",
          flexGrow: 1,
        }}
      >
        {loading && (
          <ActivityIndicator
            size={"large"}
            color={COLOURS.primary}
            style={{
              transform: [{ scale: 2 }],
              flex: 1,
              alignSelf: "center",
              height: 36 * 2
            }}
          />
        )}
        {!loading && expiredIngredients.length > 0 && (
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
        )}

        {!loading && getMainIngredients(height, width)}
      </ScrollView>
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
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  dummyCard: {
    width: Math.min(Dimensions.get("screen").width, Dimensions.get("screen").height) / 3 - SPACING.medium * 2,
    height: Math.min(Dimensions.get("screen").width, Dimensions.get("screen").height) / 3 - SPACING.medium * 2,
    position: "relative",
    aspectRatio: 1,
    margin: SPACING.small,
    justifyContent: "center",
    borderRadius: RADIUS.standard,
  },
});
