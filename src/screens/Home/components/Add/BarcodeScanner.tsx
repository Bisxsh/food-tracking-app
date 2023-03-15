import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useState } from "react";
import { COLOURS, SPACING } from "../../../../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
//import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
import { Camera, FlashMode } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { getIngredientBuilder } from "../../../../util/FoodAPIHelper";
import { HomeContext } from "../HomeContextProvider";
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';

export type Props = {};

const BarcodeScanner = (props: Props) => {
  const [showFlash, setShowFlash] = useState(false);
  const [permission, requestPermission] = BarCodeScanner.usePermissions();
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

  if (!permission?.granted){
    requestPermission()
  }

  if (scanned) return <View style={{ backgroundColor: "red" }}></View>;

  return (
    <View style={styles.container}>
      {/* <LinearGradient
        colors={["rgba(0,0,0,0.6)", "transparent"]}
        style={styles.gradient}
      /> */}
      <View style={styles.menuBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: SPACING.small }}
        >
          <MaterialCommunityIcons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ color: COLOURS.white }}>Barcode Scanner</Text>
        <MaterialCommunityIcons
          name={showFlash ? "flash" : "flash-off"}
          size={24}
          color="white"
          style={{ padding: SPACING.small }}
          onPress={() => setShowFlash((i) => !i)}
        />
      </View>
      {/* <Camera
        onBarCodeScanned={handleBarCodeScanned}
        style={styles.scanner}
        flashMode={showFlash ? FlashMode.torch : FlashMode.off}
        // barCodeScannerSettings={{
        //   barCodeTypes: Platform.OS === 'ios' ? [] : ['ean13', 'ean8', 'code128']
        // }}
      /> */}
      <BarCodeScanner
        style={styles.scanner}
        onBarCodeScanned={!scanned? handleBarCodeScanned: undefined}
      />
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
