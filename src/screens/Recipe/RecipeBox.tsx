import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  Button,
  Image,
  Linking,
  Pressable,
  Alert,
} from "react-native";
import { Colors, Header } from "react-native/Libraries/NewAppScreen";
import { getRecipes } from "../../util/GetRecipe";
import {
  COLOURS,
  DROP_SHADOW,
  FONT_SIZES,
  RADIUS,
  SPACING,
} from "../../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { requestMicrophonePermissionsAsync } from "expo-camera";
import CardDetail, { RecipeCardIcon } from "./components/CardDetail";
import { Meal } from "../../backends/Meal";
import { readAllMeal } from "../../backends/Database";
import * as DB from "../../backends/Database";
import { Ingredient } from "../../backends/Ingredient";
import { Nutrition } from "../../backends/Nutrition";
import { UserDataContext } from "../../../src/classes/UserData";
import { getSaved } from "../../util/GetRecipe";
import { useNavigation } from "@react-navigation/native";
import { RecipeContext } from "./RecipeContextProvider";

type Props = {
  recipe: Meal;
  ignoreFav: boolean;
  savedRecipe: React.Dispatch<React.SetStateAction<any[]>>;
};

const RecipeBox = (props: Props) => {
  const isDarkMode = false;
  const recipe = props.recipe;

  const [isFavourite, setIsFavourite] = useState(false);
  const { userData, setUserData } = useContext(UserDataContext);
  const { recipeContext, setRecipeContext } = useContext(RecipeContext);
  const navigation = useNavigation<any>();

  useEffect(() => {
    checkFavourite();
  }, []);

  async function checkFavourite() {
    let meals = await readAllMeal();
    meals.map((meal) => {
      if (meal.name == recipe.name) {
        setIsFavourite(!isFavourite);
      }
    });
  }

  async function genSaved(recipes: any) {
    props.savedRecipe(recipes);
  }

  async function updateFavorite() {
    //TODO add to favorites

    setIsFavourite(!isFavourite);
    // console.log(recipe)
    if (isFavourite) {
      await DB.deleteMeal(recipe.name);
      await getSaved().then((res) => {
        setUserData({ ...userData, savedRecipes: res });
        genSaved(res);
      });
    } else {
      recipe.favourite = true;
      await DB.create(recipe);
      await getSaved().then((res) => {
        setUserData({ ...userData, savedRecipes: res });
        genSaved(res);
      });
      // await DB.deleteMeal(recipe.name)
    }

    // _id: "int primary key not null",
    // name: "ntext not null",
    // url: "ntext",
    // imgSrc: "ntext",
    // categoryId: "text",
    // instruction: "ntext",
    // ingredient: "ntext",
  }

  return (
    <View style={{ width: "100%", paddingHorizontal: SPACING.medium }}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          setRecipeContext({
            ...recipeContext,
            viewedRecipeFavourite: isFavourite,
            recipeBeingViewed: recipe,
          });
          navigation.navigate("RecipeInfo");
        }}
      >
        <View style={{ position: "relative" }}>
          {recipe.imgSrc ? (
            <Image source={{ uri: recipe.imgSrc }} style={styles.foodImage} />
          ) : (
            <MaterialCommunityIcons
              name="image-off"
              size={128}
              color={COLOURS.darkGrey}
              style={{ alignSelf: "center" }}
            />
          )}
          {recipe.time ? (
            <View style={styles.timeContainer}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color="black"
              />
              <Text style={{ marginLeft: SPACING.tiny }}>
                {recipe.time || "?"} mins
              </Text>
            </View>
          ) : (
            <></>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textHeading} numberOfLines={1}>
            {recipe.name}
          </Text>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-around",
              flex: 1,
              paddingTop: SPACING.small,
            }}
          >
            <CardDetail
              icon={RecipeCardIcon.CALORIES}
              text={`${Math.round(
                (recipe.nutrition?.energy || 0) / recipe.servings //need to add calorie to class
              )} Calories`}
            />
            <CardDetail
              icon={RecipeCardIcon.ALLERGENS}
              text={
                recipe.cautions && recipe.cautions.length > 0
                  ? `Contains ${recipe.cautions?.join(", ")}`
                  : "No Allergens"
              }
            />
            <CardDetail
              icon={RecipeCardIcon.INGREDIENTS}
              text={`${recipe.ingredient?.length || "?"} ingredients`}
            />
          </View>
        </View>
      </TouchableOpacity>
      <View style={{ position: "absolute", top: 20, right: 30 }}>
        {props.ignoreFav ? null : (
          <TouchableOpacity
            onPress={() => {
              updateFavorite();
            }}
          >
            <MaterialCommunityIcons
              name={isFavourite ? "star" : "star-outline"}
              size={24}
              color={isFavourite ? COLOURS.primary : "black"}
              style={{ marginLeft: SPACING.small }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
export default RecipeBox;

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.small,
    height: 128,
    flexDirection: "row",
    backgroundColor: COLOURS.grey,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  foodImage: {
    borderRadius: RADIUS.small,
    width: 128,
    aspectRatio: 1,
  },

  textContainer: {
    padding: SPACING.medium,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    flex: 1,
  },

  textHeading: {
    fontSize: FONT_SIZES.medium,
  },

  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    alignSelf: "center",
    paddingVertical: SPACING.tiny,
    paddingHorizontal: SPACING.tiny,
    backgroundColor: "rgba(238, 238, 238, 0.9)",
    borderRadius: RADIUS.tiny,
    marginBottom: SPACING.tiny,
    marginLeft: SPACING.tiny,
  },

  favContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    left: 50,
    alignSelf: "center",
    paddingVertical: SPACING.tiny,
    paddingHorizontal: SPACING.tiny,
    backgroundColor: "rgba(238, 238, 238, 0.9)",
  },
});
