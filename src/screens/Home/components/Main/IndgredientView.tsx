import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../../../../classes/UserData";
import IngredientCard from "./IngredientCard";
import { SPACING } from "../../../../util/GlobalStyles";

type Props = {};

const IndgredientView = (props: Props) => {
  const { userData, setUserData } = useContext(UserDataContext);
  console.log(userData.storedIngredients);

  return (
    <UserDataContext.Consumer>
      {(value) => {
        console.log("CHANGED");
        return (
          <View style={styles.container}>
            {value.userData.storedIngredients.map((ingredient) => {
              return <IngredientCard ingredient={ingredient} />;
            })}
          </View>
        );
      }}
    </UserDataContext.Consumer>
  );
};

export default IndgredientView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: SPACING.small,
  },
});
