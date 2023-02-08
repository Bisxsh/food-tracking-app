import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Modal from "react-native-modal/dist/modal";
import {
  COLOURS,
  DROP_SHADOW,
  RADIUS,
  SPACING,
} from "../../../../util/GlobalStyles";
import BarcodeScanner from "./BarcodeScanner";

type Props = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
};

const AddMenu = (props: Props) => {
  const [showBarcode, setShowBarcode] = useState(false);
  return (
    <>
      <Modal
        isVisible={props.showModal}
        onBackdropPress={() => props.setShowModal(false)}
        backdropOpacity={0}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        style={{
          position: "absolute",
          //TODO change to work with device for presentation
          width: "90%",
          bottom: 40,
        }}
      >
        <View style={styles.container}>
          <TouchableOpacity style={[styles.button, styles.primary]}>
            <MaterialCommunityIcons
              name="barcode-scan"
              size={48}
              color="white"
              onPress={() => {
                setShowBarcode(true);
                props.setShowModal(false);
              }}
            />
            <Text style={{ color: COLOURS.white, textAlign: "center" }}>
              Barcode
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondary]}>
            <MaterialCommunityIcons
              name="pencil-box-outline"
              size={48}
              color={COLOURS.primary}
            />
            <Text
              style={{
                color: COLOURS.primary,
                textAlign: "center",
              }}
            >
              Manual
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {showBarcode && (
        <BarcodeScanner
          showBarcode={showBarcode}
          setShowBarcode={setShowBarcode}
        />
      )}
    </>
  );
};

export default AddMenu;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLOURS.white,
    borderRadius: 10,
    padding: SPACING.medium,
    alignItems: "center",
    justifyContent: "space-around",
    ...DROP_SHADOW,
  },

  button: {
    paddingTop: SPACING.medium,
    paddingBottom: SPACING.medium,
    paddingLeft: 48,
    paddingRight: 48,
    borderRadius: RADIUS.small,
    textAlign: "center",
    borderColor: COLOURS.primary,
    borderWidth: 1,
  },

  primary: {
    backgroundColor: COLOURS.primary,
  },

  secondary: {
    backgroundColor: COLOURS.white,
  },
});
