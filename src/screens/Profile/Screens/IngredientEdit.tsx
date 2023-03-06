import {
    Alert,
    AlertButton,
ScrollView,
StyleSheet,
Text,
TouchableOpacity,
useWindowDimensions,
View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";

import { COLOURS, ICON_SIZES, SPACING } from "../../../util/GlobalStyles";
import { User, UserContext } from "../../../backends/User";
import { useNavigation } from "@react-navigation/native";
import { UserDataContext } from "../../../classes/UserData";
import { HomeContext } from "../../Home/components/HomeContextProvider";
import { Category } from "../../../backends/Category";
import * as Categories from "../../../classes/Categories"
import NameAndImage from "../../../components/NameAndImage";
import DateField from "../../../components/DateField";
import ChipsSelectors from "../../../components/ChipsSelectors";
import InputFieldWithUnits from "../../../components/InputFieldWithUnits";
import InputField from "../../../components/InputField";
import NumberInputRow from "../../Home/components/Add/NumberInputRow";
import { IngredientBuilder, weightUnit } from "../../../classes/IngredientClass";
import { ScreenProp } from "../ProfileNavigator";
import { Ingredient } from "../../../backends/Ingredient";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DB from '../../../backends/Database'

type alertProp = {
    title: string
    desc: string
    buttons: AlertButton[],
    user: User
}

function createAlert(prop: alertProp){
    Alert.alert(
        prop.title,
        prop.desc,
        prop.buttons,
        {userInterfaceStyle:(prop.user.setting.isDark())?"dark":"light"}
    )
}

var edited = false

const IngredientEdit = (navigation: ScreenProp) => {
    const { userData, setUserData } = useContext(UserDataContext);
    const [showNutrition, setShowNutrition] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(user.setting.isDark());
    const tempIngredient = Ingredient.fromList(navigation.route.params?.toList()!)
    const [categories, setCategories] = useState<Categories.Category[]>(
        user.categories.map((cat) => {
        return {
            ...cat,
            active:
            tempIngredient
                .categoryId
                .filter(
                (id) =>
                    id==cat._id
                ).length > 0,
        };
        })
    );

    function getSeperator() {
        return <View style={{ height: SPACING.medium }} />;
    }

    navigation.navigation.setOptions({
        title:"Edit "+tempIngredient.name,
        headerRight: ()=>(
            <TouchableOpacity
                onPress={()=>{
                    if (tempIngredient.name == ""){
                        createAlert({
                            title: "Name missing",
                            desc: "Name cannot be empty",
                            buttons: [{text: "OK"}],
                            user: user
                        })
                    }else if (tempIngredient.weight == 0){
                        createAlert({
                            title: "Weight missing",
                            desc: "Weight cannot be zero",
                            buttons: [{text: "OK"}],
                            user: user
                        })
                    }else{
                        DB.updateIngredient(tempIngredient)
                    navigation.navigation.goBack()
                    }
                }}
                disabled={!edited}
            >
                <MaterialCommunityIcons
                    name="check"
                    size={ICON_SIZES.medium}
                    color={isDarkMode ? COLOURS.white : COLOURS.black}
                />
            </TouchableOpacity>
        )
    })

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
                position: "absolute",
                paddingBottom: SPACING.medium,
                paddingLeft: SPACING.medium,
                paddingRight: SPACING.medium,
                bottom: 0,
                height: "100%",
                width: "100%",
            }}
            edges={['left', 'right']}
        >
            <ScrollView>
                <NameAndImage
                    onImgChange={(str) => {
                        tempIngredient.imgSrc = str
                        edited = true
                    }}
                    onNameChange={(str) => {
                        tempIngredient.name = str
                        edited = true
                    }}
                    imgStr={tempIngredient.imgSrc}
                    nameStr={tempIngredient.name}
                />
                {getSeperator()}
                <DateField
                    fieldName="Expiry Date"
                    required
                    width={useWindowDimensions().width - 2 * SPACING.medium}
                    setValue={(date: Date) => {
                        tempIngredient.expiryDate = date
                        edited = true
                    }}
                    defaultValue={tempIngredient.expiryDate}
                />
                {getSeperator()}
                <DateField
                    fieldName="Used Date"
                    width={useWindowDimensions().width - 2 * SPACING.medium}
                    setValue={(date: Date) => {
                        tempIngredient.useDate = date
                        edited = true
                    }}
                    defaultValue={tempIngredient.useDate}
                />
                {getSeperator()}
                <ChipsSelectors
                    fieldName="Categories"
                    categories={categories}
                    setCategories={(categories: Categories.Category[]) => setCategories(categories)}
                    onAdd={(category: Categories.Category) => {
                        setUserData({
                        ...userData,
                        ingredientCategories: [
                            ...userData.ingredientCategories,
                            category,
                        ],
                        });
                        if (user.findCategory(category.name) == undefined){
                            const newCat = new Category(category.name, category.colour, undefined, category.active)
                            user.categories.push(newCat)
                            setUser(user)
                            DB.updateUser(user)
                            DB.create(newCat)
                        }
                        edited = true
                    }}
                />
                {getSeperator()}
                <View style={styles.inputRow}>
                <InputFieldWithUnits
                    fieldName="Total weight"
                    onTextChange={(weight) => {
                        tempIngredient.weight = weight;
                        edited = true
                    }}
                    units={Object.values(weightUnit)}
                    onUnitChange={(unit) => {
                        tempIngredient.weightUnit = unit
                        edited = true
                    }}
                    required
                    textWidth={104}
                    maxWidth={180}
                    defaultText={tempIngredient.weight?.toString() || undefined}
                    defaultUnit={tempIngredient.weightUnit}
                />
                <View style={{ width: SPACING.medium }} />
                <InputField
                    fieldName="Quantity"
                    onTextChange={(quantity) => {
                        tempIngredient.quantity = quantity
                        edited
                    }}
                    numberInput
                    textHint="Quantity"
                    defaultValue={
                        tempIngredient.quantity == 0
                            ? undefined
                            : tempIngredient.quantity.toString()
                    }
                />
                </View>
                {getSeperator()}
                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => setShowNutrition((p) => !p)}
                >
                <MaterialCommunityIcons
                    name={showNutrition ? "chevron-down" : "chevron-right"}
                    size={24}
                    color={isDarkMode ? "white" : "black"}
                />
                <Text style={{ color: isDarkMode ? COLOURS.white : COLOURS.darker }}>
                    Nutritional information
                </Text>
                </TouchableOpacity>
                {getSeperator()}
                {showNutrition && (
                <View>
                    <InputFieldWithUnits
                        fieldName="Serving size"
                        onTextChange={(weight) => {
                            tempIngredient.servingSize = weight;
                            edited = true
                        }}
                        units={Object.values(weightUnit)}
                        onUnitChange={(unit) =>{
                            tempIngredient.servingSizeUnit = unit
                            edited = true
                        }}
                        textWidth={104}
                        maxWidth={180}
                        defaultText={
                            tempIngredient.servingSize?.toString() || undefined
                        }
                        defaultUnit={tempIngredient.servingSizeUnit}
                    />
                    {getSeperator()}
                    <NumberInputRow
                        fieldNameLeft="Energy"
                        fieldNameRight="Protein"
                        onTextChangeLeft={(val) =>{
                            tempIngredient.nutrition.energy = val
                            edited = true
                        }}
                        onTextChangeRight={(val) =>{
                            tempIngredient.nutrition.protein = val
                            edited
                        }}
                        textHintLeft="kcal"
                        textHintRight="g"
                        defaultValueLeft={
                            tempIngredient.nutrition.energy == 0
                            ? undefined
                            : tempIngredient.nutrition.energy?.toString() || undefined
                        }
                        defaultValueRight={
                            tempIngredient.nutrition.protein == 0
                            ? undefined
                            : tempIngredient.nutrition.protein?.toString() || undefined
                        }
                    />
                    {getSeperator()}
                    <NumberInputRow
                        fieldNameLeft="Fat"
                        fieldNameRight="Saturated Fat"
                        onTextChangeLeft={(val) =>{
                            tempIngredient.nutrition.energy = val
                            edited = true
                        }}
                        onTextChangeRight={(val) =>{
                            tempIngredient.nutrition.saturatedFat = val
                            edited = true
                        }}
                        textHintLeft="g"
                        textHintRight="g"
                        defaultValueLeft={
                            tempIngredient.nutrition.fat == 0
                            ? undefined
                            : tempIngredient.nutrition.fat?.toString() || undefined
                        }
                        defaultValueRight={
                            tempIngredient.nutrition.saturatedFat == 0
                            ? undefined
                            : tempIngredient.nutrition.saturatedFat?.toString() || undefined
                        }
                    />
                    {getSeperator()}
                    <NumberInputRow
                        fieldNameLeft="Carbohydrates"
                        fieldNameRight="Sugar"
                        onTextChangeLeft={(val) =>{
                            tempIngredient.nutrition.carbs = val
                            edited = true
                        }}
                        onTextChangeRight={(val) =>{
                            tempIngredient.nutrition.sugar = val
                            edited = true
                        }}
                        textHintLeft="g"
                        textHintRight="g"
                        defaultValueLeft={
                            tempIngredient.nutrition.carbs == 0
                            ? undefined
                            : tempIngredient.nutrition.carbs?.toString() || undefined
                        }
                        defaultValueRight={
                            tempIngredient.nutrition.sugar == 0
                            ? undefined
                            : tempIngredient.nutrition.sugar?.toString() || undefined
                        }
                    />
                    {getSeperator()}
                    <NumberInputRow
                        fieldNameLeft="Fiber"
                        fieldNameRight="Salt"
                        onTextChangeLeft={(val) =>{
                            tempIngredient.nutrition.fibre = val
                            edited = true
                        }}
                        onTextChangeRight={(val) =>{
                            tempIngredient.nutrition.salt = val
                            edited = true
                        }}
                        textHintLeft="g"
                        textHintRight="g"
                        defaultValueLeft={
                            tempIngredient.nutrition.fibre == 0
                            ? undefined
                            : tempIngredient.nutrition.fibre?.toString() || undefined
                        }
                        defaultValueRight={
                            tempIngredient.nutrition.salt == 0
                            ? undefined
                            : tempIngredient.nutrition.salt?.toString() || undefined
                        }
                    />
                    {getSeperator()}
                </View>
                )}

                <View style={{ height: SPACING.medium }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default IngredientEdit;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        paddingBottom: SPACING.medium,
        paddingLeft: SPACING.medium,
        paddingRight: SPACING.medium,
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

    inputRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
    },
});
