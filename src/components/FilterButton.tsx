import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Octicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  COLOURS,
  DROP_SHADOW,
  FONT_SIZES,
  RADIUS,
  SPACING,
} from "../util/GlobalStyles";
import CustomSearchBar from "./CustomSearchBar";
import Checkbox from "./Checkbox";

type Props = {
  options: any[];
  width?: number;
  textHint?: string;
};

const FilterButton = (props: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  //TODO synchronize with filters
  const [filters, setFilters] = useState<boolean[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const transitionAnim = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showModal ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();

    Animated.timing(transitionAnim, {
      toValue: showModal ? 0 : -10,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [showModal]);

  function changeActiveFilter(index: number) {
    const newFilters = [...filters];
    newFilters[index] = !filters[index];
    console.log(newFilters);
    setFilters(newFilters);
  }

  return (
    <View style={{ position: "relative" }}>
      <TouchableOpacity
        style={styles(props).button}
        onPress={() => setShowModal(true)}
      >
        <MaterialCommunityIcons name="filter-variant" size={24} color="black" />
      </TouchableOpacity>
      <Animated.View
        style={[
          styles(props).modal,
          { opacity: fadeAnim, translateY: transitionAnim },
        ]}
      >
        <CustomSearchBar
          text={searchText}
          setText={setSearchText}
          textHint={props.textHint || "                    "}
        />
        <View style={{ height: SPACING.small }} />
        {props.options?.map((option, index) => {
          return (
            <View key={`filter-${index}`} style={styles(props).modalOption}>
              <Checkbox
                initialVal={false}
                onPress={() => changeActiveFilter(index)}
              />
              <Text>{option}</Text>
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
};

export default FilterButton;

const styles = (props: Props) =>
  StyleSheet.create({
    button: {
      padding: SPACING.small,
      backgroundColor: COLOURS.grey,
      borderRadius: RADIUS.circle,
      aspectRatio: 1,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },

    modal: {
      position: "absolute",
      top: "85%",
      right: "85%",
      paddingTop: SPACING.medium,
      paddingBottom: SPACING.medium,
      alignSelf: "stretch",
      backgroundColor: COLOURS.white,
      width: props.width ? props.width : "auto",
      direction: "rtl",
      borderRadius: RADIUS.standard,
      ...DROP_SHADOW,
    },

    modalHeading: {
      fontSize: FONT_SIZES.medium,
      textAlign: "center",
      marginBottom: SPACING.medium,
    },

    modalOption: {
      padding: SPACING.small,
      paddingLeft: SPACING.medium,
      paddingRight: SPACING.medium,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
  });
