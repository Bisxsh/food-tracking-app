import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLOURS, SPACING } from "../../../../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  showBarcode: boolean;
  setShowBarcode: (showBarcode: boolean) => void;
};

const BarcodeScanner = (props: Props) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(0,0,0,0.8)", "transparent"]}
        style={styles.gradient}
      />
      <View style={styles.menuBar}>
        <TouchableOpacity onPress={() => props.setShowBarcode(false)}>
          <MaterialCommunityIcons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ color: COLOURS.white }}>Barcode Scanner</Text>
        <MaterialCommunityIcons name="flash-off" size={24} color="white" />
      </View>
    </View>
  );
};

export default BarcodeScanner;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    padding: SPACING.medium,
    paddingTop: SPACING.large + 16,
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },

  menuBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: SPACING.medium,
    paddingRight: SPACING.medium,
  },

  gradient: {
    position: "absolute",
    width: "120%",
    height: 96,
    top: 0,
  },
});
