import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { COLOURS, SPACING } from "../../../../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getIngredientBuilder } from "../../../../util/FoodAPIHelper";
import { HomeContext } from "../HomeContextProvider";
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';

export type Props = {};

const BarcodeScanner = (props: Props) => {
  const [permission, setPermission] = useState(BarCodeScanner.usePermissions()[0])
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation<any>();
  const { homeContext, setHomeContext } = useContext(HomeContext);

  const handleBarCodeScanned = (info: BarCodeScannerResult) => {
    if (!info.data) {
      return;
    }
    setScanned(true);
    navigation.goBack();
    console.log(
      `https://world.openfoodfacts.org/api/v0/product/${info.data}.json`
    );

    fetch(`https://world.openfoodfacts.org/api/v0/product/${info.data}.json`)
      .then((response) => response.json())
      .then((responseJson) => {
        let ingBuilder = getIngredientBuilder(responseJson);
        setHomeContext({
          ...homeContext,
          ingredientBeingEdited: ingBuilder,
        });

        navigation.navigate("ManualIngredient");
        setScanned(false);
      })
      .catch((error) => {
        console.log(error);

        alert("Failed to get ingredient information. Please enter manually.");
        navigation.navigate("ManualIngredient");
        setScanned(false);
      });
  };

  useEffect(()=>{
    if (permission == null || !permission.granted){
      BarCodeScanner.requestPermissionsAsync().then((request)=>{
        if (request.granted){
          setPermission(request)
        }else{
          navigation.goBack();
        }
      })
    }
  }, [])
  
  if (scanned) return <View style={{ backgroundColor: "red" }}></View>;

  return (
    <View style={styles.container}>
      <View style={styles.menuBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: SPACING.small }}
        >
          <MaterialCommunityIcons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ color: COLOURS.white }}>Barcode Scanner</Text>
        <View style={{width: 24, height: 24}} />
      </View>
      {permission?.granted && <BarCodeScanner
        style={styles.scanner}
        onBarCodeScanned={!scanned? handleBarCodeScanned: undefined}
      />}
      {!permission?.granted && <View style={styles.scanner} />}
    </View>
  );
};

export default BarcodeScanner;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    padding: SPACING.medium,
    paddingTop: SPACING.large,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
    backgroundColor: COLOURS.white,
  },

  menuBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: SPACING.medium,
    paddingRight: SPACING.medium,
    zIndex: 10,
  },

  gradient: {
    position: "absolute",
    width: "120%",
    height: 96,
    top: 0,
  },

  scanner: {
    flex: 1,
    position: "absolute",
    top: 0,
    width: Dimensions.get("screen").width * 1.8,
    left: -Dimensions.get("screen").width * 0.4,
    height: Dimensions.get("screen").height * 1.1,
    aspectRatio:
      Dimensions.get("screen").width / Dimensions.get("screen").height,
  },
});
