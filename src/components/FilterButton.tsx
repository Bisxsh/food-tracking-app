import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import {
  COLOURS,
  DROP_SHADOW,
  FONT_SIZES,
  RADIUS,
  SPACING,
  USER_COLOURS,
} from "../util/GlobalStyles";
import CustomSearchBar from "./CustomSearchBar";
import Checkbox from "./Checkbox";
import Modal from "react-native-modal/dist/modal";
import { Category } from "../classes/Categories";
import ColourPicker from "./ColourPicker";
import * as DB from "../backends/Database";
import * as CategoryBack from "../backends/Category";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";
import { ScrollView } from "react-native";

type Props = {
  options: Category[];
  width?: number;
  textHint?: string;
  onAdd: (arg: Category) => void; //Method to run in add section if search returns no results
  setOptions: (options: Category[]) => void;
  plusSymbol?: boolean;
  center?: boolean;
};

const FilterButton = (props: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [showInnerModal, setShowInnerModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [colour, setColour] = useState(USER_COLOURS[0]);
  const [categoryName, setCategoryName] = useState("");
  //TODO synchronize with filters
  const [filters, setFilters] = useState<Category[]>(
    props.options
      ? props.options.map((o, index) => {
          return {
            ...o,
          };
        })
      : []
  );

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const transitionAnim = useRef(new Animated.Value(-4)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showModal ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();

    Animated.timing(transitionAnim, {
      toValue: showModal ? 0 : -4,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [showModal]);

  useEffect(() => {
    setSearchText("");
    setFilters(
      props.options.map((o, index) => {
        return {
          ...o,
        };
      })
    );
  }, [showModal, props.options]);

  useEffect(() => {
    if (searchText == "")
      setFilters(
        props.options.map((o, index) => {
          return {
            ...o,
          };
        })
      );
    setFilters((prev: any) =>
      prev
        .map((o: any) => {
          if (o.name.toLowerCase().includes(searchText.toLowerCase())) return o;
          else return null;
        })
        .filter((o: any) => o != null)
    );
  }, [searchText]);

  function changeActiveFilter(index: number) {
    const newFilters = [...props.options];
    newFilters[index].active = !newFilters[index].active;
    props.setOptions && props.setOptions(newFilters);
  }

  function getOptions() {
    const list = filters?.map((option: any, index: number) => {
      return (
        <View key={`filter-${index}`} style={styles(props).modalOption}>
          <Checkbox
            initialVal={option.active}
            onPress={() => changeActiveFilter(option.id)}
          />
          <View
            style={{
              width: 12,
              aspectRatio: 1,
              backgroundColor: option.colour,
              borderRadius: RADIUS.circle,
              marginRight: SPACING.small,
            }}
          />
          <Text style={{ fontSize: FONT_SIZES.medium }}>{option.name}</Text>
        </View>
      );
    });

    list.push(
      <TouchableOpacity
        key="add"
        style={styles(props).modalOption}
        onPress={() => {
          //props.onAdd && props.onAdd(searchText);
          setCategoryName(searchText);
          setShowInnerModal(true);
        }}
      >
        <MaterialCommunityIcons name="plus" size={24} color="black" />
        <Text>{searchText || "Create a category"}</Text>
      </TouchableOpacity>
    );

    return list;
  }

  const optionsStyles = {
    optionsContainer: {
      paddingTop: SPACING.medium,
      paddingBottom: SPACING.medium,
      backgroundColor: COLOURS.white,
      width: props.width ? props.width : "auto",
      borderRadius: RADIUS.standard,
      ...DROP_SHADOW,
      maxHeight: 350,
    },
  };

  return (
    <>
      <Menu>
        <MenuTrigger style={styles(props).button}>
          <MaterialCommunityIcons
            name={props.plusSymbol ? "plus" : "filter-variant"}
            size={24}
            color="black"
          />
        </MenuTrigger>
        <MenuOptions customStyles={optionsStyles}>
          <ScrollView>
            <CustomSearchBar
              text={searchText}
              setText={setSearchText}
              textHint={props.textHint || "                    "}
            />
            <View style={{ height: SPACING.small }} />
            {getOptions()}
          </ScrollView>
        </MenuOptions>
      </Menu>
      <Modal
        isVisible={showInnerModal}
        onBackdropPress={() => setShowInnerModal(false)}
        backdropOpacity={0.5}
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={StyleSheet.absoluteFill}
      >
        <View style={styles(props).modalContainer}>
          <ColourPicker colour={colour} setColour={setColour} />
          <TextInput
            placeholderTextColor="grey"
            placeholder={"Category name"}
            style={styles(props).textInput}
            value={categoryName}
            onChangeText={(text) => setCategoryName(text)}
          />
          <MaterialCommunityIcons
            name="arrow-right-thin"
            style={styles(props).confirmButton}
            size={SPACING.medium}
            onPress={() => {
              setShowInnerModal(false);
              let newOptions = [
                ...props.options,
                {
                  colour,
                  name: categoryName,
                  active: false,
                  id: props.options.length,
                },
              ];
              DB.create(
                new CategoryBack.Category(
                  categoryName,
                  colour,
                  undefined,
                  false
                )
              );
              props.setOptions(newOptions);
              if (props.onAdd) props.onAdd(newOptions[newOptions.length - 1]);
            }}
          />
        </View>
      </Modal>
    </>
    // <>
    //   <TouchableOpacity
    //     style={styles(props).button}
    //     onPress={() => {
    //       setShowModal(true);
    //     }}
    //   >
    //     <MaterialCommunityIcons
    //       name={props.plusSymbol ? "plus" : "filter-variant"}
    //       size={24}
    //       color="black"
    //     />
    //   </TouchableOpacity>

    //   <Modal
    //     isVisible={showModal}
    //     onBackdropPress={() => setShowModal(false)}
    //     backdropOpacity={props.center ? 0.5 : 0}
    //     animationIn="fadeInDown"
    //     animationOut="fadeOutUp"
    //     style={
    //       props.center
    //         ? StyleSheet.absoluteFill
    //         : {
    //             position: "absolute",
    //             //TODO change to work with device for presentation
    //             top: 50,
    //             right: 30,
    //           }
    //     }
    //   >
    //     <Animated.ScrollView
    //       style={[
    //         styles(props).modal,
    //         { opacity: fadeAnim, translateY: transitionAnim },
    //       ]}
    //     >
    //       <CustomSearchBar
    //         text={searchText}
    //         setText={setSearchText}
    //         textHint={props.textHint || "                    "}
    //       />
    //       <View style={{ height: SPACING.small }} />
    //       {getOptions()}
    //       {props.options.length > 7 && (
    //         <View style={{ height: SPACING.medium }} />
    //       )}
    //     </Animated.ScrollView>

    //     <Modal
    //       isVisible={showInnerModal}
    //       onBackdropPress={() => setShowInnerModal(false)}
    //       backdropOpacity={0.5}
    //       animationIn="zoomIn"
    //       animationOut="zoomOut"
    //       style={StyleSheet.absoluteFill}
    //     >
    //       <View style={styles(props).modalContainer}>
    //         <ColourPicker colour={colour} setColour={setColour} />
    //         <TextInput
    //           placeholderTextColor="grey"
    //           placeholder={"Category name"}
    //           style={styles(props).textInput}
    //           value={categoryName}
    //           onChangeText={(text) => setCategoryName(text)}
    //         />
    //         <MaterialCommunityIcons
    //           name="arrow-right-thin"
    //           style={styles(props).confirmButton}
    //           size={SPACING.medium}
    //           onPress={() => {
    //             setShowInnerModal(false);
    //             let newOptions = [
    //               ...props.options,
    //               { colour, name: categoryName, active: false, id: props.options.length },
    //             ];
    //             console.log(newOptions)
    //             DB.create(new CategoryBack.Category(categoryName, colour, undefined, false))
    //             props.setOptions(newOptions);
    //             if (props.onAdd) props.onAdd(newOptions[newOptions.length - 1]);
    //           }}
    //         />
    //       </View>
    //     </Modal>
    //   </Modal>
    // </>
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

    modalContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: COLOURS.white,
      padding: SPACING.medium,
      borderRadius: RADIUS.standard,
      ...DROP_SHADOW,
    },

    textInput: {
      minWidth: 200,
      marginLeft: SPACING.small,
    },

    confirmButton: {
      borderRadius: RADIUS.circle,
      padding: SPACING.small,
    },
  });
