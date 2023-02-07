import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  COLOURS,
  DROP_SHADOW,
  FONT_SIZES,
  RADIUS,
  SPACING,
} from "../util/GlobalStyles";

type Props = {
  options: any[];
  selectedOption: number; // From useState
  setSelectedOption: (option: number) => void;
  width?: number;
};

const SortButton = (props: Props) => {
  const [showModal, setShowModal] = useState(false);
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
        <Text style={styles(props).modalHeading}>Sort By</Text>
        {props.options?.map((option, index) => {
          return (
            <TouchableOpacity
              key={`filter-${index}`}
              style={{
                ...styles(props).modalOption,
                backgroundColor:
                  props.selectedOption === index ? COLOURS.grey : COLOURS.white,
              }}
              onPress={() => {
                props.setSelectedOption(index);
                setShowModal(false);
              }}
            >
              <MaterialCommunityIcons
                name={index % 2 == 0 ? "arrow-up-thin" : "arrow-down-thin"}
                size={24}
                color="black"
              />
              <Text>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
};

export default SortButton;

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
