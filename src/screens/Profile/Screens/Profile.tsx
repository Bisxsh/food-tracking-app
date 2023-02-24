import { MaterialIcons } from '@expo/vector-icons';
import React, {useContext, useEffect, useState} from 'react';
import {Text, View, ScrollView, TouchableOpacity, Image, Dimensions} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import { COLOURS, FONT_SIZES, ICON_SIZES, RADIUS, SPACING } from '../../../util/GlobalStyles';
import { UserContext } from '../../../backends/User';
import { ScreenProp } from '../ProfileNavigator';

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


export function Profile({navigation, route}:ScreenProp): JSX.Element {
  const { user, setUser } = useContext(UserContext);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(user.setting.isDark())
  const [name, setName] = useState(user.name)
  const [img, setImg] = useState(user.imgSrc)
  const [date, setDate] = useState(new Date())
  const [dataType, setDataType] = useState("mass")
  const [halfYear, setHalfYear] = useState<keyof Months["short"]>((date.getMonth() < 7)? 1 :2)
  const [waste, setWaste] = useState<number>(0)

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
              {"wasted in "+months.long[halfYear][date.getMonth()]}
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
                    data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100
                    ]
                  }
                ]
              }}
              width={Dimensions.get("window").width - SPACING.medium*2 - SPACING.small*2}
              height={Dimensions.get("window").width/2}
              yAxisSuffix="g"
              yAxisInterval={1}
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
                date.setMonth(data.index)
                setWaste(Number(data.value.toFixed(3)))
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
                  if (halfYear == 1){
                    date.setFullYear(date.getFullYear() - 1)
                    setHalfYear(2)
                  }else{
                    setHalfYear(1)
                  }
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
                }}
              >
                <Text style={{flex:1, alignSelf:"center"}}>Cost</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={()=>{
                  if (halfYear == 2){
                    date.setFullYear(date.getFullYear() + 1)
                    setHalfYear(1)
                  }else{
                    setHalfYear(2)
                  }
                }}
              >
                <MaterialIcons 
                  name="arrow-right" 
                  color={isDarkMode ? COLOURS.white: COLOURS.black} 
                  size={ICON_SIZES.large} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView> 
      </View>
    </SafeAreaView>
  );
}
