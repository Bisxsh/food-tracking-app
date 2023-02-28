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
} from "react-native";
import { Colors, Header } from "react-native/Libraries/NewAppScreen";
import { getRecipes, getSaved } from "../../util/GetRecipe";
import { getDietReq } from "../../util/GetRecipe";
import { COLOURS, DROP_SHADOW, RADIUS, SPACING } from "../../util/GlobalStyles";
import RecipeBox from "../../components/RecipeBox";
import HomeMenu from "./HomeMenu";
import { useNavigation } from "@react-navigation/native";
import { UserDataContext } from "../../classes/UserData";
import { UserContext } from "../../backends/User";
import { HomeSortingFilter, HomeSortingFilters } from "./HomeSortingFilters";
import AddButton from "../../components/AddButton";
import { readAllMeal } from "../../backends/Database";
import { Meal } from "../../classes/MealClass";

export function Recipe(): JSX.Element {
  const { user, setUser } = useContext(UserContext);

  const isDarkMode = user.setting.isDark();

  useNavigation()?.setOptions({
    tabBarStyle: {
      backgroundColor: isDarkMode ? Colors.darker : Colors.white,
    },
  });

  const navigation = useNavigation<any>();

  const [recipes, setRecipes] = useState<any[]>([]);
  const [explore, setExplore] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [ingredientsSearch, setIngredientsSearch] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const { userData, setUserData } = useContext(UserDataContext);
  const [selectedSort, setSelectedSort] = useState(userData.homePageSort || 0);


  async function readMeals() {
    await readAllMeal().then((meals) => {
      let temp: Meal[] = [];
      meals.map((meal) => {
        temp.push(new Meal(meal.name, meal.categoryId, meal.instruction, meal._id, meal.url, meal.imgSrc));
      });
      setUserData({ ...userData, savedRecipes: temp });
    }).then(() => genSaved());
  }

  useEffect(() => {
    readMeals();
    genRecipe();
    getDietReq();
  }, []);

  async function genRecipe() {
    const recipeList = await getRecipes();
    setRecipes(recipeList);
    setExplore(recipeList);
  }

  async function genSaved() {
    const recipeList = userData.savedRecipes;
    console.log(recipeList)
    setSaved(recipeList);
  }

  function switchList() {
    if (currentButton === true) {
      setRecipes(explore);
    } else {
      setRecipes(saved);
    }
    setCurrentButton(!currentButton);
  }

  const [currentButton, setCurrentButton] = useState(false);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? Colors.darker : Colors.white },
      ]}
    >
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            {
              backgroundColor: currentButton === false ? "black" : "white",
            },
            styles.menuButton,
          ]}
          onPress={() => (currentButton === true ? switchList() : null)}
        >
          <Text style={{ color: currentButton === false ? "white" : "black" }}>
            Explore
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuButton,
            {
              backgroundColor: currentButton === true ? "black" : "white",
            },
          ]}
          onPress={() => (currentButton === false ? switchList() : null)}
        >
          <Text style={{ color: currentButton === true ? "white" : "black" }}>
            Saved
          </Text>
        </TouchableOpacity>
      </View>
      <HomeMenu
        sortFilters={HomeSortingFilters}
        ingredientsSearch={ingredientsSearch}
        sort={HomeSortingFilters.indexOf(selectedSort)}
        setIngredientsSearch={setIngredientsSearch}
        setSort={(i: number) => setSelectedSort(HomeSortingFilters[i])}
      />
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
      >
        {recipes.map((recipe, key) => {
          // if (
          //   [].every((elem) => recipe["recipe"]["healthLabels"].includes(elem))
          // ) temporary fix for health labels
          {
            return (
              <RecipeBox
                key={key}
                recipe = {recipe}
              />
            );
          }
        })}
      </ScrollView>
      <AddButton onPress={() => navigation.navigate("ManualIngredient")} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SPACING.extraLarge,
    paddingLeft: SPACING.medium,
    paddingRight: SPACING.medium,
    flexDirection: "column",
    borderRadius: 10,
  },

  foodImage: {
    borderRadius: RADIUS.small,
    width: 124,
    height: 124,
    marginRight: "auto",
    marginBottom: "auto",
  },

  textHeading: {
    left: "35%",
    bottom: "80%",
    fontSize: 16,
  },

  buttonContainer: {
    flexDirection: "row",
    marginBottom: SPACING.medium,
    justifyContent: "space-between",
  },

  menuButton: {
    padding: SPACING.medium + 8,
    paddingTop: SPACING.medium,
    paddingBottom: SPACING.medium,
    borderRadius: RADIUS.circle,
    marginLeft: SPACING.medium,
    marginRight: SPACING.medium,

    alignItems: "center",
    justifyContent: "center",
  },
});
