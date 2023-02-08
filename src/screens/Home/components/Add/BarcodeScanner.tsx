import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { COLOURS, SPACING } from "../../../../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
import { Camera, FlashMode } from "expo-camera";

type Props = {
  showBarcode: boolean;
  setShowBarcode: (showBarcode: boolean) => void;
};

const BarcodeScanner = (props: Props) => {
  const [showFlash, setShowFlash] = useState(false);

  const handleBarCodeScanned = (info: any) => {
    console.log(info);
    props.setShowBarcode(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", "transparent"]}
        style={styles.gradient}
      />
      <View style={styles.menuBar}>
        <TouchableOpacity
          onPress={() => props.setShowBarcode(false)}
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
      <Camera
        onBarCodeScanned={handleBarCodeScanned}
        style={styles.scanner}
        flashMode={showFlash ? FlashMode.torch : FlashMode.off}
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
    width: Dimensions.get("screen").width * 1.8,
    position: "absolute",
    top: 0,
    left: -Dimensions.get("screen").width * 0.4,
    height: Dimensions.get("screen").height * 1.1,
    aspectRatio:
      Dimensions.get("screen").width / Dimensions.get("screen").height,
  },
});
