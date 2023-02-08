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
import CustomSearchBar from "./CustomSearchBar";
import Checkbox from "./Checkbox";
import Modal from "react-native-modal/dist/modal";
import { getFilteredList } from "../util/SearchUtil";

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
  const [searchedOptions, setSearchedOptions] = useState(props.options);

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

  useEffect(() => {
    if (searchText == "") setSearchedOptions(props.options);
    setSearchedOptions(getFilteredList(searchText, props.options));
  }, [searchText]);

  function changeActiveFilter(index: number) {
    const newFilters = [...filters];
    newFilters[index] = !filters[index];
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

      <View style={{ backgroundColor: "purple", position: "relative" }}>
        <Modal
          isVisible={showModal}
          onBackdropPress={() => setShowModal(false)}
          backdropOpacity={0.1}
          animationIn="fadeInDown"
          animationOut="fadeOutUp"
          style={{
            position: "absolute",
            //TODO change to work with device for presentation
            top: 50,
            right: 30,
          }}
        >
          <Animated.ScrollView
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
            {searchedOptions?.map((option, index) => {
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
            {props.options.length > 7 && (
              <View style={{ height: SPACING.medium }} />
            )}
          </Animated.ScrollView>
        </Modal>
      </View>
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
      paddingTop: SPACING.medium,
      paddingBottom: SPACING.medium,
      alignSelf: "stretch",
      backgroundColor: COLOURS.white,
      width: props.width ? props.width : "auto",
      direction: "rtl",
      borderRadius: RADIUS.standard,
      ...DROP_SHADOW,
      maxHeight: 350,
      overflow: "scroll",
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
