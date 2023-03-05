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
import { Meal } from "../../backends/Meal"
import { readAllMeal } from "../../backends/Database";
import * as DB from '../../backends/Database';
import { Ingredient } from "../../backends/Ingredient";
import { Nutrition } from "../../backends/Nutrition";
import { UserDataContext } from "../../../src/classes/UserData";
import { getSaved } from "../../util/GetRecipe";

type Props = {
  recipeName: string;
  recipeImage: string;
  recipeCalories: string;
  recipeServings: string;
  recipeCautions: any;
  recipeIngredients: string;
  recipeLink: string;
};

const RecipeBox = (props: Props) => {
  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [isFavourite, setIsFavourite] = useState(false);
  const { userData, setUserData } = useContext(UserDataContext);

  useEffect(() => {
    checkFavourite()
  }, [])

  async function checkFavourite() {
    let meals = await readAllMeal()
    meals.map((meal) => {
      if(meal.name == props.recipeName){
        setIsFavourite(!isFavourite)
      }
    })
  }

  const openURI = async () => {
    const url = props.recipeLink; //URL to be opened.
    const supported = await Linking.canOpenURL(url); //To check if URL is supported or not.
    if (supported) {
    await Linking.openURL(url); // It will open the URL on browser.
    } else {
    Alert.alert(`Don't know how to open this URL: ${url}`);
    }
    }

    async function updateFavorite() {
      //TODO add to favorites
      // console.log(isFavourite)
      setIsFavourite(!isFavourite)
      // console.log(isFavourite)
      if(isFavourite){
      // console.log(await readAllMeal())
      await DB.deleteMeal(props.recipeName)
      setUserData({...userData, savedRecipes: await getSaved()});
      }
      else{
        console.log("its favourited")
        let meal = new Meal(props.recipeName, [], ["what"], [], Math.floor(Math.random() * 1000), props.recipeLink, props.recipeImage)
        await DB.create(meal)
        // console.log(await readAllMeal())
        setUserData({...userData, savedRecipes: await getSaved()});
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
      <TouchableOpacity style={styles.container} onPress={openURI}>
        <View style={{ position: "relative" }}>
          <Image source={{ uri: props.recipeImage}} style={styles.foodImage} />
          <View style={styles.timeContainer}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color="black"
            />
            {/* TODO implement time here */}
            <Text style={{ marginLeft: SPACING.tiny }}>30 mins</Text>
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
      <View style={{ position: "absolute", top:20, right: 30}}>
          <TouchableOpacity onPress={() => {updateFavorite()}}>
          <MaterialCommunityIcons
            name={(isFavourite) ?  "star": "star-outline"}
            size={24}
            color={(isFavourite) ? COLOURS.primary: "black"}
            style={{ marginLeft: SPACING.small }}
          />
          </TouchableOpacity>
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
