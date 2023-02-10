import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { COLOURS, SPACING } from "../../../../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Dimensions } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { IngredientBuilder } from "../../../../classes/IngredientClass";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import ChipsSelectors from "../../../../components/ChipsSelectors";
import NameAndImage from "../../../../components/NameAndImage";
import { Category } from "../../../../classes/Categories";
import { UserDataContext } from "../../../../classes/UserData";
import DateField from "../../../../components/DateField";

type Props = {
  setShowManual: (showManual: boolean) => void;
};

const ManualIngredient = (props: Props) => {
  const ingredientBuilder = new IngredientBuilder();
  const { userData, setUserData } = useContext(UserDataContext);
  const [categories, setCategories] = useState<Category[]>(
    userData.ingredientCategories
  );

  function getSeperator() {
    return <View style={{ height: SPACING.medium }} />;
  }

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
      <DateField
        fieldName="Expiry Date"
        required
        width={Dimensions.get("screen").width - 2 * SPACING.medium}
        setValue={(date: Date) => ingredientBuilder.setExpiryDate(date)}
      />
      {getSeperator()}
      <ChipsSelectors
        fieldName="Categories"
        categories={categories}
        setCategories={setCategories}
        onAdd={(category: Category) => {
          setUserData({
            ...userData,
            ingredientCategories: [...userData.ingredientCategories, category],
          });
        }}
      />
      {getSeperator()}
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
