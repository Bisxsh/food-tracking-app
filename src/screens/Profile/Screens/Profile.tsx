import { MaterialIcons } from '@expo/vector-icons';
import React, {useContext, useEffect, useState} from 'react';
import {Text, View, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import { COLOURS, FONT_SIZES, ICON_SIZES, RADIUS, SPACING } from '../../../util/GlobalStyles';
import { UserContext } from '../../../backends/User';
import { ScreenProp } from '../ProfileNavigator';
import { DataSize, getMonthlyData, getMonthlyDataSet } from '../../../backends/Histories'

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

var init = true

export function Profile({navigation, route}:ScreenProp): JSX.Element {
  const { user, setUser } = useContext(UserContext);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(user.setting.isDark())
  const [name, setName] = useState(user.name)
  const [img, setImg] = useState(user.imgSrc)
  const [loading, setLoading] = useState(true)

  const [date, setDate] = useState(new Date())
  const [dataType, setDataType] = useState("mass")
  const [halfYear, setHalfYear] = useState<keyof Months["short"]>((date.getMonth() < 6)? 1 :2)
  const [waste, setWaste] = useState<number>()
  const [dataSet, setDataSet] = useState<number[]>([])

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
    setLoading(false)
  }

  useEffect(
    ()=>{
      const unsubscribe = navigation.addListener("focus", ()=>{
        setIsDarkMode(user.setting.isDark())
        setName(user.name)
        setImg(user.imgSrc)
      })
      return unsubscribe
    }, 
    [navigation]
  ) 

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? Colors.darker : Colors.white,
      }}
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
                    width: "30%",
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
                    width: "30%",
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
            {loading? <ActivityIndicator size="large" color={COLOURS.primary} />:
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
              <Text
                style={{
                  color: isDarkMode ? COLOURS.white : COLOURS.black,
                  fontSize: FONT_SIZES.medium,
                  textAlign: "center",
                }}
              >
                {date.getFullYear()}
              </Text>
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
                width={Dimensions.get("window").width - SPACING.medium*2 - SPACING.small*2}
                height={Dimensions.get("window").width/2}
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
                    setLoading(true)
                    getMonthlyDataSet(date.getFullYear(), newHalf).then((value)=>{
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
                      setLoading(false)
                    })
                  }}
                >
                  <MaterialIcons 
                    name="arrow-left" 
                    color={isDarkMode ? COLOURS.white: COLOURS.black} 
                    size={ICON_SIZES.large} 
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: (dataType == "mass")? COLOURS.primary: COLOURS.grey,
                    paddingVertical: SPACING.tiny,
                    paddingHorizontal: SPACING.medium,
                    borderRadius: RADIUS.standard,
                    flexDirection: "column",
                  }}
                  onPress={()=>{
                    setDataType("mass")
                    setLoading(true)
                    getMonthlyDataSet(date.getFullYear(), halfYear).then((value)=>{
                      setDataSet(value[0])
                      setWaste(Number(value[0][date.getMonth()-(halfYear-1)*6].toFixed(2)))
                      setLoading(false)
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
                    setLoading(true)
                    getMonthlyDataSet(date.getFullYear(), halfYear).then((value)=>{
                      setDataSet(value[1])
                      setWaste(Number(value[1][date.getMonth()-(halfYear-1)*6].toFixed(2)))
                      setLoading(false)
                    })
                  }}
                >
                  <Text style={{flex:1, alignSelf:"center"}}>Cost</Text>
                </TouchableOpacity>
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
                    setLoading(true)
                    getMonthlyDataSet(date.getFullYear(), newHalf).then((value)=>{
                      if (dataType == "mass"){
                        setDataSet(value[0])
                        setWaste(Number(value[0][value[0].length - 1].toFixed(2)))
                        date.setMonth((newHalf-1)*6+value[0].length-1)
                      }else if (dataType == "cost"){
                        setDataSet(value[1])
                        setWaste(Number(value[1][value[1].length - 1].toFixed(2)))
                        date.setMonth((newHalf-1)*6+value[1].length-1)
                      }
                      setLoading(false)
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
        </ScrollView> 
      </View>
    </SafeAreaView>
  );
}
