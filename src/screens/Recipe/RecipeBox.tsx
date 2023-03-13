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
  recipeName: string;
  recipeImage: string;
  recipeCalories: string;
  recipeServings: string;
  recipeCautions: any;
  recipeIngredients: any;
  recipeLink: string;
  source: string;
  nutrition: any[];
  servings: string;
  time: string;
  ignoreFav: boolean;
  savedRecipe: React.Dispatch<React.SetStateAction<any[]>>;
};

const RecipeBox = (props: Props) => {
  const isDarkMode = false;

  const ingredientStrings = props.recipeIngredients.map(
    (ingredient: any) => ingredient.text
  );

  const backgroundStyle = {
    backgroundColor: isDarkMode ? COLOURS.darker : Colors.lighter,
  };

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
      if (meal.name == props.recipeName) {
        setIsFavourite(!isFavourite);
      }
    });
  }

  async function genSaved(recipes: any) {
    const recipeList = recipes;
    var temp: any[] = [];
    recipeList.map((recipe: { getId: any; getName: any; getImgSrc: any; }) => {
      temp.push({
        recipe: {
          id: recipe.getId,
          label: recipe.getName,
          image: recipe.getImgSrc,
          servings: 2,
          calories: 1000.0,
          ingredients: ["Cheesse"],
          cautions: ["None"],
        },
      });
    });
    props.savedRecipe(temp);
  }

  async function updateFavorite() {
    //TODO add to favorites

    setIsFavourite(!isFavourite);

    if (isFavourite) {

      await DB.deleteMeal(props.recipeName);
      await getSaved().then((res) => {setUserData({ ...userData, savedRecipes: res }); genSaved(res);});
    } else {
      let meal = new Meal(
        props.recipeName,
        [],
        [],
        [],
        Math.floor(Math.random() * 1000),
        props.recipeLink,
        props.recipeImage
      );
      await DB.create(meal);
      await getSaved().then((res) => {setUserData({ ...userData, savedRecipes: res }); genSaved(res);});
      // await DB.deleteMeal(props.recipeName)
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
            viewedRecipeSource: props.source,
            viewedRecipeIngredients: ingredientStrings,
            viewedRecipeNutrients: props.nutrition,
            viewedRecipeServings: Number.parseInt(props.servings),
            viewedRecipeTime: Number.parseInt(props.time),
            recipeBeingViewed: new Meal(
              props.recipeName,
              [],
              [],
              [],
              Math.floor(Math.random() * 1000),
              props.recipeLink,
              props.recipeImage
            ),
          });
          navigation.navigate("RecipeInfo");
        }}
      >
        <View style={{ position: "relative" }}>
          {props.recipeImage ? (
            <Image
              source={{ uri: props.recipeImage }}
              style={styles.foodImage}
            />
          ) : (
            <MaterialCommunityIcons
              name="image-off"
              size={100}
              color={COLOURS.darkGrey}
              style={{ alignSelf: "center" }}
            />
          )}
          <View style={styles.timeContainer}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color="black"
            />
            {/* TODO implement time here */}
            <Text style={{ marginLeft: SPACING.tiny }}>
              {props.time || "?"} mins
            </Text>
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textHeading} numberOfLines={1}>
            {props.recipeName}
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
                parseInt(props.recipeCalories) / parseInt(props.recipeServings) //need to add calorie to class
              )} Calories`}
            />
            <CardDetail
              icon={RecipeCardIcon.ALLERGENS}
              text={`Contains ${props.recipeCautions.join(", ")}`}
            />
            <CardDetail
              icon={RecipeCardIcon.INGREDIENTS}
              text={`${props.recipeIngredients.length} ingredients`}
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
        </TouchableOpacity>)}
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
