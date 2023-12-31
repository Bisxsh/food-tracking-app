import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { getRecipes, getSearchRecipe } from "../../util/GetRecipe";
import { getDietReq } from "../../util/GetRecipe";
import {
  COLOURS,
  FONT_SIZES,
  RADIUS,
  SPACING,
} from "../../util/GlobalStyles";
import RecipeBox from "./RecipeBox";
import RecipeMenu from "./RecipeMenu";
import { useNavigation } from "@react-navigation/native";
import { UserDataContext } from "../../classes/UserData";
import { User, UserContext } from "../../backends/User";
import {
  RecipeSortingFilter,
  RecipeSortingFilters,
} from "./RecipeSortingFilters";
import AddButton from "../../components/AddButton";
import { readAllMeal } from "../../backends/Database";
import { SafeAreaView } from "react-native-safe-area-context";
import { Meal } from "../../backends/Meal";
import { Nutrition } from "../../backends/Nutrition";
import { Ingredient } from "../../backends/Ingredient";
import NoDataSvg from "../../assets/no_data.svg";

export function Recipe(): JSX.Element {
  const { user, setUser } = useContext(UserContext);

  const isDarkMode = user.setting.isDark();

  useNavigation()?.setOptions({
    tabBarStyle: {
      backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
    },
  });

  const navigation = useNavigation<any>();
  const [searchIngBut, setSearchIngBut] = useState(false);
  const { userData, setUserData } = useContext(UserDataContext);
  const [loading, setLoading] = useState(true);
  const [refresh , setRefresh] = useState(userData.exploreRecipes || false);
  const [recipes, setRecipes] = useState<Meal[]>(userData.exploreRecipes || []);
  const [explore, setExplore] = useState<Meal[]>(userData.exploreRecipes || []);
  const [saved, setSaved] = useState<Meal[]>(userData.savedRecipes || []);
  const [custom, setCustom] = useState<Meal[]>(userData.customRecipes || []);
  const [currentButton, setCurrentButton] = useState(0);
  const [ingredientsSearch, setIngredientsSearch] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectedSort, setSelectedSort] = useState(
    userData.recipesPageSort || RecipeSortingFilter.TimeLowToHigh
  );
  const [dietReq, setDietReq] = useState<[string, boolean][]>([]);
  const { height, width } = useWindowDimensions();

  async function readMeals() {
    const meals = await readAllMeal()

    let temp: Meal[] = [];
    let temp2: Meal[] = [];
    meals.map((meal) => {
      console.log(`Meal: ${meal.name}. Url is ${meal.url}`);

      if (meal.url && meal.url != "") {
        temp.push(meal);
      } else {
        temp2.push(meal);
      }
    });

    setUserData({ ...userData, savedRecipes: temp, customRecipes: temp2 });

    setSaved(temp)
    setCustom(temp2)
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setLoading(true)
      readMeals().then(()=>{
        genRecipe().then(()=>{
          getDietReq().then((req) => {
            if (req != undefined) {
              setDietReq(req);
            }
            setCurrentButton(0)
            console.log("navigation")
            setLoading(false);
          });
        });
      });
    });
    return unsubscribe;
  }, [navigation]);


  useEffect(() => {
    //search for typed ingredient
    console.log("the indgredients search is: " + ingredientsSearch);
    if (ingredientsSearch != "") {
      setLoading(true);
      getSearchRecipe(ingredientsSearch)
        .then((recipeList) => {
          const newRecipes = recipeList.map((recipe) => getMealFromAPI(recipe.recipe))
          sortList(selectedSort, newRecipes);
          setRecipes(newRecipes);
          setLoading(false)
        });
    } else {
      setLoading(true);
      sortList(selectedSort, explore)
      setRecipes(explore);
      setLoading(false);
    }
    setSearchIngBut(false);
  }, [searchIngBut]);


  async function genRecipe() {
    if (User.refresh) {
      console.log("explore")
      await getRecipes().then((recipeList) => {
        setRecipes(recipeList);
        setExplore(recipeList);
        sortList(selectedSort);
        setUserData({ ...userData, exploreRecipes: recipeList });
      });
      User.refresh = false;
    } else {
      setRecipes(userData.exploreRecipes);
      setExplore(userData.exploreRecipes);
      sortList(selectedSort);
    }
  }

  function genSaved() {
    const recipeList = userData.savedRecipes;
    setSaved(recipeList);
  }

  function genCustom() {
    const recipeList = userData.customRecipes;
    setCustom(recipeList);
  }

  function switchList(buttonNum: number) {
    setLoading(true)
    if (buttonNum === 0) {
      setRecipes(explore);
    }
    if (buttonNum === 1) {
      setRecipes(saved);
    }
    if (buttonNum === 2) {
      setRecipes(custom);
    }
    sortList(selectedSort);
    setCurrentButton(buttonNum);
    setLoading(false)
  }

  function getCals(recipe: Meal) {
    return Math.round(
      recipe.nutrition.energy / (recipe.servings || 1) //need to add calorie to class
    );
  }

  function sortList(selected: RecipeSortingFilter, list?: Meal[]) {
    switch (selected) {
      case RecipeSortingFilter.TimeLowToHigh:
        if (list != undefined){
          list.sort((a, b) => {
            return a.time - b.time;
          })
        }else{
          recipes.sort((a, b) => {
            return a.time - b.time;
          })
        }
        break;
      case RecipeSortingFilter.TimeHighToLow:
        if (list != undefined){
          list.sort((a, b) => {
            return b.time - a.time;
          })
        }else{
          recipes.sort((a, b) => {
            return b.time - a.time;
          })
        }
        break;
      case RecipeSortingFilter.CaloriesLowToHigh:
        if (list != undefined){
          list.sort((a, b) => {
            return getCals(a) - getCals(b);
          })
        }else{
          recipes.sort((a, b) => {
            return getCals(a) - getCals(b);
          })
        }
        break;
      case RecipeSortingFilter.CaloriesHighToLow:
        if (list != undefined){
          list.sort((a, b) => {
            return getCals(b) - getCals(a);
          })
        }else{
          recipes.sort((a, b) => {
            return getCals(b) - getCals(a);
          })
        }
        break;
      case RecipeSortingFilter.IngredientsLowToHigh:
        if (list != undefined){
          list.sort((a, b) => {
            return a.ingredient.length - b.ingredient.length;
          })
        }else{
          recipes.sort((a, b) => {
            return a.ingredient.length - b.ingredient.length;
          })
        }
        break;
      case RecipeSortingFilter.IngredientsHighToLow:
        if (list != undefined){
          list.sort((a, b) => {
            return b.ingredient.length - a.ingredient.length;
          })
        }else{
          recipes.sort((a, b) => {
            return b.ingredient.length - a.ingredient.length;
          })
        }
        break;
      default:
        break;
    }
  }

  function getMainContent() {
    if (recipes.length > 0)
      return (
        <ScrollView
          style={{ width: "100%" }}
          contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
        >
          {recipes
            .filter((recipe) => {
              if (!recipe.healthLabels || recipe.healthLabels.length === 0)
                return true;
              return dietReq
                .filter((elem: any) => elem[1])
                .map((elem: any) => elem[0])
                .every((elem: any) => recipe.healthLabels!.includes(elem));
            })
            .map((recipe, key) => {
              //console.log(recipe.time);
              return (
                <RecipeBox
                  key={Math.random()}
                  recipe={recipe}
                  ignoreFav={currentButton == 2 ? true : false}
                  savedRecipe={setSaved}
                />
              );
            })}
        </ScrollView>
      );

    let message = "";
    switch (currentButton) {
      case 0:
        message =
          "You don't have any ingredients stored\nso we cant suggest any recipes 😢 \n\n Try searching for recipes above!";
        break;
      case 1:
        message =
          "You haven't saved any recipes yet 💾\n\n Try searching for recipes above!";
        break;
      case 2:
        message =
          "You haven't created any recipes yet 😢\n\n Click the button below to create a recipe!";
        break;
    }

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
            color: isDarkMode? COLOURS.white: COLOURS.black
          }}
        >
          {message}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white },
      ]}
      edges={["left", "right", "top"]}
    >
      <View style={[styles.buttonContainer]}>
        <TouchableOpacity
          style={[
            {
              backgroundColor: currentButton === 0 ? "black" : "white",
            },
            styles.menuButton,
          ]}
          onPress={() => (currentButton != 0 ? switchList(0) : null)}
        >
          <Text style={{ color: currentButton === 0 ? "white" : "black" }}>
            Explore
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuButton,
            {
              backgroundColor: currentButton === 1 ? "black" : "white",
            },
          ]}
          onPress={() => (currentButton != 1 ? switchList(1) : null)}
        >
          <Text style={{ color: currentButton === 1 ? "white" : "black" }}>
            Saved
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuButton,
            {
              backgroundColor: currentButton === 2 ? "black" : "white",
            },
          ]}
          onPress={() => (currentButton != 2 ? switchList(2) : null)}
        >
          <Text style={{ color: currentButton === 2 ? "white" : "black" }}>
            Custom
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingLeft: SPACING.small,
          paddingRight: SPACING.medium,
          width: "100%",
        }}
      >
        <RecipeMenu
          sortFilters={RecipeSortingFilters}
          ingredientsSearch={ingredientsSearch}
          sort={RecipeSortingFilters.indexOf(selectedSort)}
          setIngredientsSearch={setIngredientsSearch}
          setSort={(i: number) => {
            setLoading(true)
            setSelectedSort(RecipeSortingFilters[i])
            sortList(RecipeSortingFilters[i])
            setLoading(false)
          }}
          setSearch={setSearchIngBut}
        />
      </View>
      {!loading && getMainContent()}
      {loading && (
        <View
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: COLOURS.darker,
            opacity: 0.5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator
            size={"large"}
            color={COLOURS.white}
            style={{
              transform: [{ scale: 2 }],
            }}
          />
          <Text
            style={{
              marginTop: 36,
              color: isDarkMode ? COLOURS.white : COLOURS.darker,
              textAlign: "center",
              fontSize: FONT_SIZES.medium,
            }}
          >
            {"Loading Recipes"}
          </Text>
        </View>
      )}
      <AddButton onPress={() => navigation.navigate("ManualMeal")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SPACING.medium,
    flexDirection: "column",
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
    marginHorizontal: SPACING.medium,

    alignItems: "center",
    justifyContent: "center",
  },
});

export function getMealFromAPI(recipe: any) {

  return new Meal(
    recipe.label,
    [],
    [],
    recipe.ingredients?.map((ing: any) => {
      return new Ingredient(
        ing["food"], 
        1, 
        "g", 
        "g", 
        new Nutrition(), 
        [], 
        undefined, 
        ing["weight"],
        undefined,
        ing["image"],
        undefined,
        undefined,
        undefined,
        undefined,
        ing["text"]
      );
    }),
    undefined,
    recipe.url,
    recipe.image,
    recipe.source,
    recipe.cautions,
    recipe.healthLabels,
    new Nutrition(
      undefined,
      recipe.totalNutrients["CHOCDF.net"].quantity,
      recipe.totalNutrients["CHOCDF.net"].unit,
      recipe.totalNutrients.ENERC_KCAL.quantity,
      recipe.totalNutrients.ENERC_KCAL.unit,
      recipe.totalNutrients.PROCNT.quantity,
      recipe.totalNutrients.PROCNT.unit,
      recipe.totalNutrients.FAT.quantity,
      recipe.totalNutrients.FAT.unit,
      recipe.totalNutrients.FASAT.quantity,
      recipe.totalNutrients.FASAT.unit,
      recipe.totalNutrients.FIBTG.quantity,
      recipe.totalNutrients.FIBTG.unit,
      recipe.totalNutrients.NA.quantity,
      recipe.totalNutrients.NA.unit,
      recipe.totalNutrients.SUGAR.quantity,
      recipe.totalNutrients.SUGAR.unit
    ),
    recipe.yield,
    recipe.totalTime,
    false,
    recipe.ingredients?.map((ingredient: any) => ingredient.text)
  );
}
