import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Modal from "react-native-modal/dist/modal";
import {
  COLOURS,
  DROP_SHADOW,
  RADIUS,
  SPACING,
} from "../../../../util/GlobalStyles";
import ManualIngredient from "./ManualIngredient";
import { IngredientBuilder } from "../../../../classes/IngredientClass";
import { useNavigation } from "@react-navigation/native";
import { HomeContext } from "../HomeContextProvider";
import { UserContext } from "../../../../backends/User";


type Props = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
};

const AddMenu = (props: Props) => {
  const { homeContext, setHomeContext } = useContext(HomeContext);
  const { user, setUser } = useContext(UserContext);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(user.setting.isDark());

  const navigation = useNavigation<any>();
  
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
        <View
          style={[
            styles.container,
            { backgroundColor: isDarkMode ? COLOURS.grey : COLOURS.white },
          ]}
        >
          <TouchableOpacity style={[styles.button, styles.primary]}>
            <MaterialCommunityIcons
              name="barcode-scan"
              size={48}
              color="white"
              onPress={() => {
                navigation.navigate("BarcodeScanner");
                props.setShowModal(false);
              }}
            />
            <Text style={{ color: COLOURS.white, textAlign: "center" }}>
              Barcode
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.secondary,
              {
                backgroundColor: isDarkMode ? COLOURS.grey : COLOURS.white,
              },
            ]}
            onPress={() => {
              setHomeContext({
                ...homeContext,
                ingredientBeingEdited: new IngredientBuilder(),
              });
              navigation.navigate("ManualIngredient");
              props.setShowModal(false);
            }}
          >
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
    </>
  );
};

export default AddMenu;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
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
