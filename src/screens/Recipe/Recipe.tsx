import React, { useState, useEffect, useContext } from 'react';
import {StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Text, View, Button, Image} from 'react-native';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import { getRecipes, getSaved } from '../../util/GetRecipe';
import { getDietReq } from '../../util/GetRecipe';
import { COLOURS, DROP_SHADOW, RADIUS, SPACING } from "../../util/GlobalStyles";
import RecipeBox from '../../components/RecipeBox';
import HomeMenu from './HomeMenu';
import { useNavigation } from '@react-navigation/native';
import { UserDataContext } from "../../classes/UserData";
import { UserContext } from '../../backends/User';
import {
  HomeSortingFilter,
  HomeSortingFilters,
} from "./HomeSortingFilters";



export function Recipe(): JSX.Element {

  const { user, setUser } = useContext(UserContext);
  const isDarkMode = user.setting.isDark()
  
  useNavigation()?.setOptions({
      tabBarStyle: {
        backgroundColor: isDarkMode ? Colors.darker : Colors.white
      }
  })



  const [recipes, setRecipes] = useState<any[]>([]);
  const [explore, setExplore] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [ingredientsSearch, setIngredientsSearch] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const { userData, setUserData } = useContext(UserDataContext);
  const [selectedSort, setSelectedSort] = useState(userData.homePageSort || 0);


  useEffect(() => {
    genRecipe()
    getDietReq()
    genSaved()
  },[]);


  async function genRecipe(){
    const recipeList = await getRecipes()
    setRecipes(recipeList)
    setExplore(recipeList)
  }

  async function genSaved(){
    const recipeList = await getSaved()
    setSaved(recipeList)
  }

  function switchList(){
    if(currentButton === true){
      setRecipes(explore)
    }
    else{
      setRecipes(saved)
    }
    setCurrentButton(!currentButton)
  }



  const [currentButton, setCurrentButton] = useState(false);

  return (
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.darker : Colors.white,
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={{backgroundColor: currentButton === false ? 'black' : 'white', padding: 15, borderRadius: 20,
            marginLeft: SPACING.medium,
            marginRight: SPACING.medium,
            width: "20%",
            alignItems: "center",
            justifyContent: "center",
            
          }}
          onPress={() => switchList()}><Text style={{color: currentButton === false ? 'white' : 'black'}}>Explore</Text></TouchableOpacity>
        <TouchableOpacity style={{backgroundColor: currentButton === true ? 'black' : 'white', padding: 15, borderRadius: 20,
            marginLeft: SPACING.medium,
            marginRight: SPACING.medium,
            width: "20%",
            alignItems: "center",}}
          onPress={() => switchList()}><Text style={{color: currentButton === true ? 'white' : 'black'}}>Saved</Text></TouchableOpacity>


        </View>
        <HomeMenu
          sortFilters={HomeSortingFilters}
          ingredientsSearch={ingredientsSearch}
          sort={HomeSortingFilters.indexOf(selectedSort)}
          setIngredientsSearch={setIngredientsSearch}
          setSort={(i: number) => setSelectedSort(HomeSortingFilters[i])}
        />
        <ScrollView style={{width:"100%", left:"5%"}}>
          {recipes.map((recipe , key) => {
            if( [].every(elem => recipe["recipe"]["healthLabels"].includes(elem))){
              return (
                <RecipeBox key={key} recipeImage={recipe["recipe"]["image"]} recipeName={recipe["recipe"]["label"]} 
                recipeCalories={recipe["recipe"]["calories"]} recipeServings={recipe["recipe"]["yield"]}
                recipeCautions={recipe["recipe"]["cautions"]} recipeIngredients={recipe["recipe"]["ingredients"]}/>
                )
              } 
          })}

          </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: "3%",
    width: "90%",
    height: "15%",
    flexDirection: "column",
    backgroundColor: COLOURS.grey,
    borderRadius: 10,
    alignItems: "flex-start",
    justifyContent: "space-around",
  },


  foodImage: {
    borderRadius: RADIUS.small,
    width: 124, 
    height: 124,
    marginRight: 'auto',
    marginBottom: 'auto'
  },

  textHeading: {
    left: '35%',
    bottom: "80%",
    fontSize: 16,
  },

  buttonContainer: {
    marginTop: "15%",
    flexDirection:"row",
    marginBottom: 20,
    justifyContent: "space-between",
  }

});

