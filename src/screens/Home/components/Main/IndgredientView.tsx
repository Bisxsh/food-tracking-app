import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { FiltersContext } from "../../Home";

type Props = {};

const IndgredientView = (props: Props) => {
  const [filter, setFilter] = useContext(FiltersContext);
  console.log(filter);
  return (
    <View>
      <Text>IndgredientView</Text>
    </View>
  );
};

export default IndgredientView;

const styles = StyleSheet.create({});
