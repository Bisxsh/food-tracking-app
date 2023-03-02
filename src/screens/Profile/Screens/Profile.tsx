import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, {useContext, useEffect, useState} from 'react';
import {Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator, useWindowDimensions, StyleSheet} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import { COLOURS, DROP_SHADOW, FONT_SIZES, ICON_SIZES, RADIUS, SPACING } from '../../../util/GlobalStyles';
import { UserContext } from '../../../backends/User';
import { ScreenProp, TabNaviContext } from '../ProfileNavigator';
import { getMonthlyData, getMonthlyDataSet } from '../../../backends/Histories'
import CustomSearchBar from '../../../components/CustomSearchBar';
import SortButton from '../../../components/SortButton';
import IngredientsFilter from '../../../components/IngredientsFilter';
import { Category } from '../../../backends/Category';
import * as DB from '../../../backends/Database'
import { Ingredient } from '../../../backends/Ingredient';
import { Nutrition } from '../../../backends/Nutrition';
import Modal from 'react-native-modal/dist/modal';

type Months = {
  short: {
    0: string[],
    1: string[],
    2: string[],
  },
  long: {
    0: string[],
    1: string[],
    2: string[],
  }
}

const months: Months = {
  short: {
    0: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    1: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    2: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  long: {
    0: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    1: ["January", "February", "March", "April", "May", "June"],
    2: ["July", "August", "September", "October", "November", "December"],
  }
}

const sortOrders = {
  0: "Name: A to Z",
  1: "Name: Z to A",
  2: "Date Used: Low to High",
  3: "Date Used: High to Low",
}

type ingredientRowProp = {
  ingredient: Ingredient
  dimension: [number, number]
}

function IngredientRow(prop: ingredientRowProp): JSX.Element{
  const [showModal, setShowModal] = useState(false)

  return (
    <TouchableOpacity
      style={{
        backgroundColor: COLOURS.grey,
        borderRadius: RADIUS.standard,
        flexDirection: "row",
        marginBottom: SPACING.small,
      }}
      onPress={()=>{setShowModal(true)}}
    >
      {prop.ingredient.imgSrc != undefined && <Image
        style={{
          alignItems: "center",
          aspectRatio: 1,
          justifyContent: "center",
          borderRadius: RADIUS.standard,
        }}
        source={{uri: prop.ingredient.imgSrc}}
      />}
      {prop.ingredient.imgSrc == undefined && <View
        style={{
          alignItems: "center",
          backgroundColor: COLOURS.darkGrey,
          aspectRatio: 1,
          justifyContent: "center",
          borderRadius: RADIUS.standard,
        }}
      >
        <MaterialIcons 
          name="image-not-supported" 
          color={COLOURS.white} 
          size={ICON_SIZES.medium} 
          style={{
              textAlign: 'center'
          }}
        />
      </View>}
      <View
        style={{
          flex:1,
          flexDirection: "column",
          padding: SPACING.small,
          alignItems: "flex-start",
        }}
      >
        <Text style={{fontSize: FONT_SIZES.small}}>
          {prop.ingredient.name}
        </Text>
        <Text style={{fontSize: FONT_SIZES.tiny}}>
          {"Used on "+ ((prop.ingredient.useDate != undefined)? prop.ingredient.useDate?.toLocaleDateString(): "Unknown")}
        </Text>
      </View>
      <IngredientPopup
        showModal={showModal}
        setShowModal={setShowModal}
        ingredient={prop.ingredient}
        dimension={prop.dimension}
      />
    </TouchableOpacity>
  )
}

type searchMenuProp = {
  ingredientsSearch: string;
  setIngredientsSearch: (ingredientsSearch: string) => void;
  sort: number;
  setSort: (sort: number) => void;
  sortFilters: any[];
  showExpiringButton?: boolean;
};

const SearchMenu = (props: searchMenuProp) => {
  const { user, setUser } = useContext(UserContext);
  return (
    <View style={styles.menu}>
      <CustomSearchBar
        textHint="Search stored ingredients"
        text={props.ingredientsSearch}
        setText={props.setIngredientsSearch}
      />
      <SortButton
        options={props.sortFilters}
        selectedOption={props.sort}
        setSelectedOption={props.setSort}
      />
      <IngredientsFilter
        options={user.categories}
        setOptions={(options) =>{
          user.categories = options.map((value)=>new Category(value.name, value.colour, value.id, value.active))
          setUser(user)
          DB.updateUser(user)
        }}
      />
    </View>
  );
};

type ingredientPopupProp = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  ingredient: Ingredient;
  dimension: [number, number]
};

const IngredientPopup = (prop: ingredientPopupProp) => {
  const { user, setUser } = useContext(UserContext);

  function Header() {
    return (
      <View style={styles.header}>
        {prop.ingredient.imgSrc != undefined && <Image
          style={{
            alignItems: "center",
            aspectRatio: 1,
            justifyContent: "center",
            borderRadius: RADIUS.standard,
            width: Math.min(...prop.dimension)/4
          }}
          source={{uri: prop.ingredient.imgSrc}}
        />}
        {prop.ingredient.imgSrc == undefined && <View
          style={{
            alignItems: "center",
            backgroundColor: COLOURS.darkGrey,
            aspectRatio: 1,
            justifyContent: "center",
            borderRadius: RADIUS.standard,
            width: Math.min(...prop.dimension)/4
          }}
        >
          <MaterialIcons 
            name="image-not-supported" 
            color={COLOURS.white} 
            size={ICON_SIZES.medium} 
            style={{
                textAlign: 'center'
            }}
          />
        </View>}
        <View style={{ flexDirection: "column", justifyContent: "center", paddingLeft: SPACING.small }}>
          <Text style={{ fontSize: FONT_SIZES.body, fontWeight: "500" }}>
            {prop.ingredient.name}
          </Text>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="scale-balance"
              size={24}
              color="black"
            />
            <Text
              style={{
                marginLeft: SPACING.small,
                fontSize: FONT_SIZES.small,
              }}
            >
              {prop.ingredient.weight} {prop.ingredient.weightUnit}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="calendar-outline"
              size={24}
              color="black"
            />
            <Text
              style={{
                marginLeft: SPACING.small,
                fontSize: FONT_SIZES.small,
              }}
            >{`Used on: `+ ((prop.ingredient.useDate != undefined)? prop.ingredient.useDate?.toLocaleDateString(): "Unknown")}</Text>
          </View>
        </View>
      </View>
    );
  }

  function Nutrition(nutrition: Nutrition) {
    return (
      <View style={styles.nutritionContainer}>
        <View style={{ flex: 1 }} />
        <View style={styles.nutritionColumn}>
          <Text style={styles.nutrition}>Energy: </Text>
          <Text style={styles.nutrition}>Fat: </Text>
          <Text style={styles.nutrition}>Carbs: </Text>
          <Text style={styles.nutrition}>Fiber: </Text>
        </View>
        <View style={styles.nutritionColumn}>
          <Text style={styles.nutrition}>{nutrition.energy}g</Text>
          <Text style={styles.nutrition}>{nutrition.fat}g</Text>
          <Text style={styles.nutrition}>{nutrition.carbs}g</Text>
          <Text style={styles.nutrition}>{nutrition.fibre}g</Text>
        </View>
        <View style={{ flex: 1 }} />
        <View style={styles.nutritionColumn}>
          <Text style={styles.nutrition}>Protein: </Text>
          <Text style={styles.nutrition}>Salt: </Text>
          <Text style={styles.nutrition}>Sugar: </Text>
          <Text style={styles.nutrition}>Sat. Fat:</Text>
        </View>
        <View style={styles.nutritionColumn}>
          <Text style={styles.nutrition}>{nutrition.protein}g</Text>
          <Text style={styles.nutrition}>{nutrition.salt}g</Text>
          <Text style={styles.nutrition}>{nutrition.sugar}g</Text>
          <Text style={styles.nutrition}>{nutrition.saturatedFat}g</Text>
        </View>
        <View style={{ flex: 1 }} />
      </View>
    );
  }

  return (
    <Modal
      isVisible={prop.showModal}
      onBackdropPress={() => prop.setShowModal(false)}
      backdropOpacity={0}
      animationIn="zoomIn"
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.container}>
        <Header />
        <View style={styles.categories}>
          {prop.ingredient.categoryId.map((id) => {
            const category = user.findCategory(id)
            if (category != undefined){
              return (
                <View
                  style={[
                    styles.category,
                    {
                      backgroundColor: category.colour,
                    },
                  ]}
                  key={category.name}
                >
                  <Text>{category.name}</Text>
                </View>
              );
            }
          })}
        </View>
        {Nutrition(prop.ingredient.nutrition)}
        
        <TouchableOpacity
          style={styles.edit}
          onPress={() => {
            // setHomeContext({
            //   ...homeContext,
            //   ingredientBeingEdited: IngredientBuilder.fromIngredient(
            //     props.ingredient
            //   ),
            // });
            // navigation.navigate("ManualIngredient");
          }}
        >
          <MaterialCommunityIcons name="pencil" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

var init = true

export function Profile({navigation, route}:ScreenProp): JSX.Element {
  const { user, setUser } = useContext(UserContext);
  const { tabNavi, setTabNavi } = useContext(TabNaviContext)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(user.setting.isDark())
  const [name, setName] = useState(user.name)
  const [img, setImg] = useState(user.imgSrc)
  const [loadingChart, setloadingChart] = useState(true)

  const [date, setDate] = useState(new Date())
  const [dataType, setDataType] = useState("mass")
  const [halfYear, setHalfYear] = useState<keyof Months["short"]>((date.getMonth() < 6)? 1 :2)
  const [waste, setWaste] = useState<number>()
  const [dataSet, setDataSet] = useState<number[]>([])

  const [sort, setSort] = useState<number>(0)
  const [searchText, setSearchText] = useState<string>("")
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loadingIng, setLoadingIng] = useState(true)

  const {height, width} = useWindowDimensions()

  const today = new Date()

  if (init){
    init = false
    initLoad()
  }

  async function initLoad(){
    const data = await getMonthlyData(date.getFullYear(), date.getMonth()+1)
    const dataSet = await getMonthlyDataSet(date.getFullYear(), halfYear)
    if (dataType == "mass"){
      setWaste(Number(data[0].toFixed(2)))
      setDataSet(dataSet[0])
    }else if (dataType == "cost"){
      setWaste(Number(data[1].toFixed(2)))
      setDataSet(dataSet[1])
    }
    setloadingChart(false)
    const ing = await DB.searchIngredient(undefined, [0,0])
    setIngredients(ing)
    setLoadingIng(false)
  }

  useEffect(
    ()=>{
      const unsubscribe = navigation.addListener("focus", ()=>{
        init = true
        setIsDarkMode(user.setting.isDark())
        setName(user.name)
        setImg(user.imgSrc)
      })
      return unsubscribe
    }, 
    [navigation]
  )
  
  useEffect(
    ()=>{
      const unsubscribe = (tabNavi != undefined)? tabNavi.addListener("focus", ()=>{
        initLoad()
      }): ()=>{}
      return unsubscribe
    }, 
    [tabNavi]
  )

  function getDateInMiliSec(ingredient: Ingredient): number{
    return (ingredient.useDate != undefined)? ingredient.useDate.getTime(): 0
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? Colors.darker : Colors.white,
      }}
      edges={['left', 'right', "top"]}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
        }}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.darker : Colors.white,
            flexDirection: "row",
            justifyContent: "flex-end",
            margin: SPACING.small,
          }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
            }}
            onPress={()=>{
              navigation.navigate("Setting")
            }}
          >
            <MaterialIcons 
              name="settings" 
              color={
                (isDarkMode)?COLOURS.white: COLOURS.black
              } 
              size={ICON_SIZES.medium} 
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{
            flex: 1,
            alignSelf: "stretch",
            flexDirection: "column",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: SPACING.medium,
            }}
          >
            {img != undefined && <Image
                style={{
                    alignItems: "center",
                    aspectRatio: 1,
                    width: Math.min(height, width)*0.2,
                    justifyContent: "center",
                    alignSelf: "center",
                    borderRadius: 100
                }}
                source={{uri: img}}
            />}
            {img == undefined && <View
                style={{
                    alignItems: "center",
                    backgroundColor: COLOURS.darkGrey,
                    aspectRatio: 1,
                    width: Math.min(height, width)*0.2,
                    justifyContent: "center",
                    alignSelf: "center",
                    borderRadius: 100
                }}
            >
              <Text
                style={{
                  color: COLOURS.white,
                  fontSize: FONT_SIZES.heading
                }}
              >{user.name.charAt(0)}</Text>
            </View>}
            <View
              style={{
                flex: 1,
                flexDirection:"column",
                paddingHorizontal:SPACING.medium,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: isDarkMode ? COLOURS.white : COLOURS.black,
                  fontSize: FONT_SIZES.body
                }}
              >{name}</Text>
              <Text
                style={{
                  color: isDarkMode ? COLOURS.white : COLOURS.black,
                  fontSize: FONT_SIZES.small
                }}
              >Saving food since {user.dateOfReg.toLocaleDateString()}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              padding: SPACING.small,
              margin: SPACING.medium,
              borderColor: COLOURS.grey,
              borderWidth: 1,
              backgroundColor: isDarkMode ? Colors.darker : Colors.white,
              borderRadius: RADIUS.standard,
            }}
          >
            {loadingChart? <ActivityIndicator size="large" color={COLOURS.primary} />:
            <React.Fragment>
              <Text
                style={{
                  color: isDarkMode ? COLOURS.white : COLOURS.black,
                  fontSize: FONT_SIZES.medium,
                }}
              >
                <Text
                  style={{
                    color: COLOURS.primary,
                    fontWeight: "bold",
                  }}
                >
                  {((dataType=="cost")?"£":"")+waste+((dataType=="mass")?"g":"")+" "}
                </Text>
                {"wasted in "+months.long[0][date.getMonth()]}
              </Text>
              {/* <Text
                style={{
                  color: isDarkMode ? COLOURS.white : COLOURS.black,
                  fontSize: FONT_SIZES.medium,
                  textAlign: "center",
                }}
              >
                {date.getFullYear()}
              </Text> */}
              <LineChart
                data={{
                  labels: months.short[halfYear],
                  datasets: [
                    {
                      data: [0,0,0,0,0,0],
                      color: (opacity = 0) => `rgba(0, 255, 0, 0)`,
                      withDots: false,
                    },
                    {
                      data: dataSet,
                    },
                    
                  ],
                }}
                width={width - SPACING.medium*2 - SPACING.small*2 - useSafeAreaInsets().right - useSafeAreaInsets().left}
                height={(width - useSafeAreaInsets().right - useSafeAreaInsets().left)/2}
                yAxisSuffix={(dataType == "mass")?"g":undefined}
                yAxisLabel={(dataType == "cost")?"£":undefined}
                yAxisInterval={1}
                hidePointsAtIndex={[]}
                withShadow={false}
                chartConfig={{
                  backgroundGradientFrom: isDarkMode ? Colors.darker : Colors.white,
                  backgroundGradientTo: isDarkMode ? Colors.darker : Colors.white,
                  decimalPlaces: 0,
                  color: (opacity = 1) => COLOURS.primary,
                  labelColor: (opacity = 1) => isDarkMode ? COLOURS.white: COLOURS.black,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "4",
                    strokeWidth: "2",
                    stroke: COLOURS.primary
                  }
                }}
                onDataPointClick={(data)=>{
                  date.setMonth((halfYear-1)*6 + data.index)
                  setWaste(Number(data.value.toFixed(2)))
                }}
                style={{
                  marginVertical: SPACING.small,
                  borderRadius: 16,
                  alignSelf: "center"
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <TouchableOpacity
                  onPress={()=>{
                    var newHalf: 1|2 = 1
                    if (halfYear == 1){
                      date.setFullYear(date.getFullYear() - 1)
                      setHalfYear(2)
                      newHalf = 2
                    }else{
                      setHalfYear(1)
                      newHalf = 1
                    }
                    setloadingChart(true)
                    getMonthlyDataSet(date.getFullYear(), newHalf).then((value)=>{
                      if (value[0].length != 0){
                        if (dataType == "mass"){
                          setDataSet(value[0])
                          date.setMonth((newHalf-1)*6+value[0].length-1)
                          setWaste(Number(value[0][value[0].length - 1].toFixed(2)))
                          console.log()
                        }else if (dataType == "cost"){
                          setDataSet(value[1])
                          setWaste(Number(value[1][value[1].length - 1].toFixed(2)))
                          date.setMonth((newHalf-1)*6+value[1].length-1)
                        }
                      }else{
                        setDataSet([])
                        setWaste(0)
                        date.setMonth((newHalf-1)*6+value[1].length-1)
                      }
                      setloadingChart(false)
                    })
                  }}
                >
                  <MaterialIcons 
                    name="arrow-left" 
                    color={isDarkMode ? COLOURS.white: COLOURS.black} 
                    size={ICON_SIZES.large} 
                  />
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={{
                    backgroundColor: (dataType == "mass")? COLOURS.primary: COLOURS.grey,
                    paddingVertical: SPACING.tiny,
                    paddingHorizontal: SPACING.medium,
                    borderRadius: RADIUS.standard,
                    flexDirection: "column",
                  }}
                  onPress={()=>{
                    setDataType("mass")
                    setloadingChart(true)
                    getMonthlyDataSet(date.getFullYear(), halfYear).then((value)=>{
                      setDataSet(value[0])
                      setWaste(Number(value[0][date.getMonth()-(halfYear-1)*6].toFixed(2)))
                      setloadingChart(false)
                    })
                  }}
                >
                  <Text style={{flex:1, alignSelf:"center"}}>Mass</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: (dataType == "cost")? COLOURS.primary: COLOURS.grey,
                    paddingVertical: SPACING.tiny,
                    paddingHorizontal: SPACING.medium,
                    borderRadius: RADIUS.standard,
                    flexDirection: "column",
                  }}
                  onPress={()=>{
                    setDataType("cost")
                    setloadingChart(true)
                    getMonthlyDataSet(date.getFullYear(), halfYear).then((value)=>{
                      setDataSet(value[1])
                      setWaste(Number(value[1][date.getMonth()-(halfYear-1)*6].toFixed(2)))
                      setloadingChart(false)
                    })
                  }}
                >
                  <Text style={{flex:1, alignSelf:"center"}}>Cost</Text>
                </TouchableOpacity> */}
                <Text
                  style={{
                    color: isDarkMode ? COLOURS.white : COLOURS.black,
                    fontSize: FONT_SIZES.medium,
                    textAlign: "center",
                  }}
                >
                  {date.getFullYear()}
                </Text>
                <TouchableOpacity
                  onPress={()=>{
                    var newHalf: 1|2 = 1 
                    if (halfYear == 2){
                      date.setFullYear(date.getFullYear() + 1)
                      setHalfYear(1)
                      newHalf = 1
                    }else{
                      setHalfYear(2)
                      newHalf = 2
                    }
                    setloadingChart(true)
                    getMonthlyDataSet(date.getFullYear(), newHalf).then((value)=>{
                      if (value[0].length != 0){
                        if (dataType == "mass"){
                          setDataSet(value[0])
                          setWaste(Number(value[0][value[0].length - 1].toFixed(2)))
                          date.setMonth((newHalf-1)*6+value[0].length-1)
                        }else if (dataType == "cost"){
                          setDataSet(value[1])
                          setWaste(Number(value[1][value[1].length - 1].toFixed(2)))
                          date.setMonth((newHalf-1)*6+value[1].length-1)
                        }
                      }else{
                        setDataSet([])
                        setWaste(0)
                        date.setMonth((newHalf-1)*6+value[1].length-1)
                      }
                      setloadingChart(false)
                    })
                  }}
                >
                  <MaterialIcons 
                    name="arrow-right" 
                    color={isDarkMode ? COLOURS.white: COLOURS.black} 
                    size={ICON_SIZES.large} 
                  />
                </TouchableOpacity>
              </View>
            </React.Fragment>
            }
          </View>
          <View
            style={{
              flexDirection: "column",
            }}
          >
            <View
              style={{
                paddingRight: SPACING.medium,
                paddingLeft: SPACING.small,
                paddingBottom: SPACING.medium,
              }}  
            >
              <SearchMenu
                sort={sort}
                sortFilters={Object.values(sortOrders)}
                setSort={(value)=>{
                  setLoadingIng(true)
                  switch (value){
                    case 0:
                      ingredients.sort((a,b)=>(a.name < b.name? -1:1))
                      break;
                    case 1:
                      ingredients.sort((a,b)=>(a.name > b.name? -1:1))
                      break;
                    case 2:
                      ingredients.sort((a,b)=>(getDateInMiliSec(a) < getDateInMiliSec(b)? -1:1))
                      break;
                    case 3:
                      ingredients.sort((a,b)=>(getDateInMiliSec(a) > getDateInMiliSec(b)? -1:1))
                      break;
                  }
                  setIngredients(ingredients)
                  setSort(value)
                  setLoadingIng(false)
                }}
                ingredientsSearch={searchText}
                setIngredientsSearch={async (text)=>{
                  setLoadingIng(true)
                  const ing = await DB.searchIngredient(text, [0,0])
                  switch (sort){
                    case 0:
                      ing.sort((a,b)=>(a.name < b.name? -1:1))
                      break;
                    case 1:
                      ing.sort((a,b)=>(a.name > b.name? -1:1))
                      break;
                    case 2:
                      ing.sort((a,b)=>(getDateInMiliSec(a) < getDateInMiliSec(b)? -1:1))
                      break;
                    case 3:
                      ing.sort((a,b)=>(getDateInMiliSec(a) > getDateInMiliSec(b)? -1:1))
                      break;
                  }
                  setIngredients(ing)
                  setSearchText(text)
                  setLoadingIng(false)
                }}
              />
            </View>
            <View
              style={{paddingHorizontal: SPACING.medium}}
            >
              {ingredients.map((value)=><IngredientRow ingredient={value} dimension={[height, width]}/>)}
            </View>
          </View>
        </ScrollView> 
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  menu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  container: {
    backgroundColor: "white",
    padding: SPACING.medium,
    borderRadius: RADIUS.standard,
    ...DROP_SHADOW,
  },

  header: { flexDirection: "row", alignItems: "center" },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.small,
  },

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: SPACING.medium,
  },

  category: {
    padding: SPACING.small,
    paddingLeft: SPACING.medium + 4,
    paddingRight: SPACING.medium + 4,
    borderRadius: RADIUS.circle,
    marginRight: SPACING.small,
  },

  nutritionContainer: {
    flexDirection: "row",
    marginTop: SPACING.medium,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.standard,
  },

  nutritionColumn: {
    margin: SPACING.medium,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  nutrition: {
    fontSize: FONT_SIZES.small,
    marginTop: SPACING.small,
  },

  edit: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: SPACING.medium,
    padding: SPACING.small,
    backgroundColor: COLOURS.grey,
    borderRadius: RADIUS.circle,
  },
});
