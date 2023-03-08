import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import IngredientViewExpiring from "./IngredientViewExpiring";
import { Ingredient } from "../../../../backends/Ingredient";
import {
  COLOURS,
  DROP_SHADOW,
  FONT_SIZES,
  RADIUS,
  SPACING,
} from "../../../../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Modal from "react-native-modal/dist/modal";
import PrimaryButton from "../../../../components/PrimaryButton";

interface ExpiringButtonProps {
  label: string;
}

const ExpiringButton: React.FC<ExpiringButtonProps> = ({ label }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
      </TouchableOpacity>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        backdropOpacity={0.3}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={{ justifyContent: "center", flexDirection: "column" }}
      >
        {/* <View style={{ flex: 1 }} /> */}
        <View style={styles.modalContainer}>
          <View style={styles.box}>
            <Text style={styles.boxText}>
              Ingredients expiring within a day:{" "}
            </Text>
          </View>
          <IngredientViewExpiring />
          <View style={{ flexDirection: "row" }}>
            <PrimaryButton
              text="Close"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
        {/* <View style={{ flex: 1 }} /> */}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOURS.red,
    padding: SPACING.small,
    borderRadius: RADIUS.circle,
    ...DROP_SHADOW,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginLeft: SPACING.small,
  },

  modalContainer: {
    //flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOURS.white,
    padding: SPACING.medium,
    borderRadius: RADIUS.standard,
    ...DROP_SHADOW,
  },
  box: {
    marginVertical: SPACING.small,
  },
  boxText: {
    color: COLOURS.black,
    fontWeight: "bold",
    fontSize: FONT_SIZES.medium,
  },
});

export default ExpiringButton;
