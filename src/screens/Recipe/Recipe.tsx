import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  Image,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { Colors, Header } from "react-native/Libraries/NewAppScreen";
import { getRecipes, getSaved, getSearchRecipe } from "../../util/GetRecipe";
import { getDietReq } from "../../util/GetRecipe";
import { COLOURS, DROP_SHADOW, FONT_SIZES, RADIUS, SPACING } from "../../util/GlobalStyles";
import RecipeBox from "./RecipeBox";
import RecipeMenu from "./RecipeMenu";
import { useNavigation } from "@react-navigation/native";
import { UserDataContext } from "../../classes/UserData";
import { UserContext } from "../../backends/User";
import {
  RecipeSortingFilter,
  RecipeSortingFilters,
} from "./RecipeSortingFilters";
import AddButton from "../../components/AddButton";
import { readAllMeal } from "../../backends/Database";
import { Meal } from "../../classes/MealClass";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabNaviContext } from './RecipeNavigator';


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
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [explore, setExplore] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [custom, setCustom] = useState<any[]>([]);
  const [ingredientsSearch, setIngredientsSearch] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const { userData, setUserData } = useContext(UserDataContext);
  const [selectedSort, setSelectedSort] = useState(
    userData.recipesPageSort || RecipeSortingFilter.TimeLowToHigh
  );
  const [dietReq, setDietReq] = useState<[string, boolean][]>([])
  const {height, width} = useWindowDimensions()

  useEffect(() => {
    //search for typed ingredient
    console.log("the indgredients search is: " + ingredientsSearch)
    if (ingredientsSearch != "") {
      setLoading(true)
      getSearchRecipe(ingredientsSearch).then((recipeList) => {setRecipes(recipeList)}).then(()=>setLoading(false))
    }
    else{
      setRecipes(explore)
    }
    setSearchIngBut(false)
  }, [searchIngBut]);


  async function readMeals() {

    await readAllMeal()
      .then((meals) => {
        let temp: Meal[] = [];
        let temp2: Meal[] = [];
        meals.map((meal) => {
          if (meal.url != "") {
            temp.push(
              new Meal(
                meal.name,
                meal.categoryId,
                meal.instruction,
                meal.ingredient,
                meal._id,
                meal.url,
                meal.imgSrc
              )
            );
          } else {
            temp2.push(
              new Meal(
                meal.name,
                meal.categoryId,
                meal.instruction,
                meal.ingredient,
                meal._id,
                meal.url,
                meal.imgSrc
              )
            );
          }
        });

        setUserData({ ...userData, savedRecipes: temp, customRecipes: temp2 });
      })
      .then(() => genSaved())
      .then(() => genCustom());
  }

  useEffect(() => {
    setLoading(true)
    readMeals();
    genRecipe();
    getDietReq().then((req)=>{
      if (req != undefined){
        setDietReq(req)
      }
      setLoading(false)
    })

  }, []);


  async function genRecipe() {
    if(userData.refreshExplore){
      await getRecipes().then((recipeList) => { setRecipes(recipeList); setExplore(recipeList); sortList(); setUserData({ ...userData, exploreRecipes: recipeList })});
      setUserData({ ...userData, refreshExplore: false })
    }
    else{
      setRecipes(userData.exploreRecipes);
      setExplore(userData.exploreRecipes);
      sortList();
    }
    

  }

  async function genSaved() {
    const recipeList = userData.savedRecipes;
    var temp: any[] = [];
    recipeList.map((recipe) => {
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
    setSaved(temp);
  }

  async function genCustom() {
    const recipeList = userData.customRecipes;
    var temp: any[] = [];
    recipeList.map((recipe) => {
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
    setCustom(temp);
  }

  function switchList(buttonNum: number) {
    if (buttonNum === 0) {
      setRecipes(explore);
      sortList();
    }
    if (buttonNum === 1) {

      setRecipes(saved);
      sortList();
    }
    if (buttonNum === 2) {
      setRecipes(custom);
      sortList();
    }
    setCurrentButton(buttonNum);
  }

  const [currentButton, setCurrentButton] = useState(0);

  function getCals(recipe: any) {

    return Math.round(
      parseInt(recipe.calories) / parseInt(recipe.yield) //need to add calorie to class
    );
  }

  function sortList() {
    switch (selectedSort) {
      case RecipeSortingFilter.TimeLowToHigh:
        //TODO implement sorting by time
        break;
      case RecipeSortingFilter.TimeHighToLow:
        //TODO implement sorting by time
        break;
      case RecipeSortingFilter.CaloriesLowToHigh:
        setRecipes((r) =>
          r.sort((a, b) => {
            return getCals(b.recipe) - getCals(a.recipe);
          })
        );
        break;
      case RecipeSortingFilter.CaloriesHighToLow:
        setRecipes((r) =>
          r.sort((a, b) => {
            return getCals(a.recipe) - getCals(b.recipe);
          })
        );
        break;
      case RecipeSortingFilter.IngredientsLowToHigh:
        setRecipes((r) =>
          r.sort((a, b) => {
            return b.recipe.ingredients.length - a.recipe.ingredients.length;
          })
        );
        break;
      case RecipeSortingFilter.IngredientsHighToLow:
        setRecipes((r) =>
          r.sort((a, b) => {
            return a.recipe.ingredients.length - b.recipe.ingredients.length;
          })
        );
        break;
    }
  }


  useEffect(() => {
    switch (selectedSort) {
      case RecipeSortingFilter.TimeLowToHigh:
        setRecipes((r) =>
          r.sort((a, b) => {
            return b.recipe.totalTime - a.recipe.totalTime;
          })
        );
        break;
      case RecipeSortingFilter.TimeHighToLow:
        setRecipes((r) =>
          r.sort((a, b) => {
            return a.recipe.totalTime - b.recipe.totalTime;
          })
        );
        break;
      case RecipeSortingFilter.CaloriesLowToHigh:
        setRecipes((r) =>
          r.sort((a, b) => {
            return getCals(b.recipe) - getCals(a.recipe);
          })
        );
        break;
      case RecipeSortingFilter.CaloriesHighToLow:
        setRecipes((r) =>
          r.sort((a, b) => {
            return getCals(a.recipe) - getCals(b.recipe);
          })
        );
        break;
      case RecipeSortingFilter.IngredientsLowToHigh:
        setRecipes((r) =>
          r.sort((a, b) => {
            return b.recipe.ingredients.length - a.recipe.ingredients.length;
          })
        );
        break;
      case RecipeSortingFilter.IngredientsHighToLow:
        setRecipes((r) =>
          r.sort((a, b) => {
            return a.recipe.ingredients.length - b.recipe.ingredients.length;
          })
        );
        break;
    }
  }, [selectedSort]);

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
      <View style={{ paddingLeft: SPACING.small, paddingRight: SPACING.medium, width: "100%" }}>
        <RecipeMenu
          sortFilters={RecipeSortingFilters}
          ingredientsSearch={ingredientsSearch}
          sort={RecipeSortingFilters.indexOf(selectedSort)}
          setIngredientsSearch={setIngredientsSearch}
          setSort={(i: number) => setSelectedSort(RecipeSortingFilters[i])}
          setSearch={setSearchIngBut}
        />
      </View>
      {!loading && <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
      >
        {recipes.map((recipe, key) => {
          if (
            //TODO implement allergies here
            dietReq.every((elem: any) => {
              if (elem[1] && (recipe["recipe"]["healthLabels"] != undefined)){
                return recipe["recipe"]["healthLabels"].includes(elem[0])
              }else{
                return true
              }
            })
          ) {
            return (
              <RecipeBox
                key={Math.random()}
                recipeImage={recipe["recipe"]["image"]}
                recipeName={recipe["recipe"]["label"]}
                recipeCalories={recipe["recipe"]["calories"]}
                recipeServings={recipe["recipe"]["yield"]}
                recipeCautions={recipe["recipe"]["cautions"]}
                recipeIngredients={recipe["recipe"]["ingredients"]}
                recipeLink={recipe["recipe"]["url"]}
                source={recipe["recipe"]["source"]}
                nutrition={[
                  recipe?.recipe?.totalNutrients?.ENERC_KCAL || "",
                  recipe?.recipe?.totalNutrients?.PROCNT || "",
                  recipe?.recipe?.totalNutrients?.FAT || "",
                  recipe?.recipe?.totalNutrients?.FASAT || "",
                  (recipe?.recipe?.totalNutrients &&
                    recipe?.recipe?.totalNutrients["CHOCDF.net"]) ||
                    "",
                  recipe?.recipe?.totalNutrients?.SUGAR || "",
                  recipe?.recipe?.totalNutrients?.FIBTG || "",
                  recipe?.recipe?.totalNutrients?.NA || "",
                ]}
                servings={recipe["recipe"]["yield"]}
                time={recipe["recipe"]["totalTime"]}
                ignoreFav={currentButton == 2 ? true : false}
                savedRecipe = {setSaved}
              />
            );
          }
        })}
      </ScrollView>}
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
                      transform: [{scale: 2}]
                    }}
                  />
                  <Text 
                    style={{
                      marginTop: 36,
                      color: isDarkMode ? COLOURS.white : COLOURS.darker,
                      textAlign: "center",
                      fontSize: FONT_SIZES.medium,
                    }}
                  >{"Loading Recipes"}</Text>
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