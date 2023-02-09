import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLOURS, SPACING } from "../../../../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NameAndImage from "../../../../components/UserInput/NameAndImage";
import InputField from "../../../../components/UserInput/InputField";
import { Dimensions } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { IngredientBuilder } from "../../../../classes/IngredientClass";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import Modal from "react-native-modal/dist/modal";

type Props = {
  setShowManual: (showManual: boolean) => void;
};

const ManualIngredient = (props: Props) => {
  const ingredientBuilder = new IngredientBuilder();
  const [showCalendar, setShowCalendar] = useState(false);

  function getSeperator() {
    return <View style={{ height: SPACING.medium }} />;
  }

  const setDateNew = (event: DateTimePickerEvent, date?: Date | undefined) => {
    const {
      type,
      nativeEvent: { timestamp },
    } = event;

    if (type === "set" && timestamp !== undefined) {
      ingredientBuilder.setExpiryDate(new Date(timestamp));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.setShowManual(false)}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text>Add an ingredient</Text>
        <TouchableOpacity style={styles.button}>
          <MaterialCommunityIcons name="check" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <NameAndImage
        onImgChange={(str) => ingredientBuilder.setImgSrc(str)}
        onNameChange={(str) => ingredientBuilder.setName(str)}
      />
      {getSeperator()}
      <InputField
        fieldName="Expiry Date"
        required
        onTextChange={(str) => {}}
        width={Dimensions.get("screen").width - 2 * SPACING.medium}
      >
        <TouchableOpacity onPress={() => setShowCalendar(true)}>
          <MaterialCommunityIcons name="calendar" size={24} color="black" />
        </TouchableOpacity>
      </InputField>
      {showCalendar && (
        <RNDateTimePicker
          value={new Date()}
          onChange={setDateNew}
          accentColor={COLOURS.primary}
          minimumDate={new Date()}
        />
      )}
    </ScrollView>
  );
};

export default ManualIngredient;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    padding: SPACING.medium,
    bottom: 0,
    backgroundColor: COLOURS.white,
    height: "100%",
    width: "100%",
    paddingTop: SPACING.large + 16,
  },

  menu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingLeft: SPACING.medium,
    paddingRight: SPACING.medium,
    paddingBottom: SPACING.large,
  },

  button: {
    padding: SPACING.small,
  },
});
