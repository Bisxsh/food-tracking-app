import React, {useContext, useState} from 'react';
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Picker } from "@react-native-picker/picker";


import * as DB from '../../../backends/Database'
import { Ingredient } from "../../../backends/Ingredient";
import { Nutrition } from "../../../backends/Nutrition";
import { Category } from "../../../backends/Category";
import { User, UserContext } from '../../../backends/User';
import { COLOURS, RADIUS, SPACING } from '../../../util/GlobalStyles';
import { Meal } from '../../../backends/Meal';


export function Debug(): JSX.Element{
    const [ing, setIng] = useState<Ingredient>();
    const [cat, setCat] = useState<Category>();
    const [meal, setMeal] = useState<Meal>();
    const [userLocal, setUserLocal] = useState<User>();
    const { user, setUser } = useContext(UserContext);
    const [selectedTable, setSelectedTable] = useState<string>("Ingredient");
    const [log, setLog] = useState<string>("");
    const isDarkMode = user.setting.isDark()

    return (
        <ScrollView
            style={{
                flexDirection: "column"
            }}
        >
            <View 
                style={{
                    flexDirection: "row",
                    backgroundColor: "red",
                }}
            >
                <View
                    style={{
                        backgroundColor: isDarkMode ? Colors.darker : Colors.white,
                        flex: 1,
                        flexDirection: "column",
                        alignItems: "flex-start",
                        alignContent: "flex-start",
                    }}
                >
                    <Text
                        style={{
                            color: isDarkMode ? COLOURS.white : COLOURS.black,
                            margin: SPACING.small,
                        }}
                    >
                        Select table
                    </Text>
                    <Picker
                        selectedValue={selectedTable}
                        onValueChange={(value, index)=>{setSelectedTable(value)}}
                        style={{
                            alignSelf:"stretch",
                            backgroundColor: isDarkMode ? Colors.darker : Colors.white,
                        }}
                    >
                        <Picker.Item label="Ingredient" value="Ingredient" style={{color: isDarkMode ? COLOURS.textTouchable : COLOURS.black,}}/>
                        <Picker.Item label="Category" value="Category" style={{color: isDarkMode ? COLOURS.textTouchable : COLOURS.black,}}/>
                        <Picker.Item label="Meal" value="Meal" style={{color: isDarkMode ? COLOURS.textTouchable : COLOURS.black,}}/>
                        <Picker.Item label="User" value="User" style={{color: isDarkMode ? COLOURS.textTouchable : COLOURS.black,}}/>
                    </Picker>
                    <View
                        style={{
                            backgroundColor: COLOURS.grey,
                            flex: 1,
                            margin: SPACING.small,
                            borderRadius: RADIUS.standard,
                            borderColor: COLOURS.darkGrey,
                            borderWidth: 1,
                            flexDirection: "row"
                        }}
                    >
                        <Text
                            style={{
                                margin: SPACING.small,
                                flex: 1,
                            }}
                        >
                            {log}
                        </Text> 
                    </View>
                </View>
                <View
                    style={{
                        backgroundColor: isDarkMode ? Colors.darker : Colors.white,
                        justifyContent: "space-around",
                        alignItems: "flex-start",
                        alignContent: "flex-start",
                    }}
                >
                    <Pressable
                        style={styles.pressable}
                        onPress={()=>{
                            DB.init();
                        }}
                    >
                        <Text>Open DB</Text>
                    </Pressable>
                    <Pressable
                        style={styles.pressable}
                        onPress={()=>{
                            switch(selectedTable){
                                case "Ingredient":
                                    const newIng = new Ingredient("Food", 1, "g", new Nutrition(), []);
                                    setIng(newIng)
                                    setLog(JSON.stringify(newIng))
                                    console.log(newIng)
                                    break;
                                case "Category":
                                    const newCat = new Category("Vegitable", "#00FF00");
                                    setCat(newCat)
                                    setLog(JSON.stringify(newCat))
                                    console.log(newCat)
                                    break;
                                case "Meal":
                                    const newMeal = new Meal("Pizza", [], ["Heat for 20 mins in 200℃ oven"])
                                    setMeal(newMeal)
                                    setLog(JSON.stringify(newMeal))
                                    console.log(newMeal)
                                    break;
                                case "User":
                                    const newUser = new User("Hello Welcome")
                                    setUserLocal(newUser)
                                    setLog(JSON.stringify(newUser))
                                    console.log(newUser)
                                    break;
                                default:
                                    break;
                            }
                        }}
                    >
                        <Text>Instantiate</Text>
                    </Pressable>
                    <Pressable
                        style={styles.pressable}
                        onPress={()=>{
                            switch(selectedTable){
                                case "Ingredient":
                                    if (ing){ DB.create(ing) }
                                    break;
                                case "Category":
                                    if (cat){ DB.create(cat) }
                                    break;
                                case "Meal":
                                    if (meal){ DB.create(meal) }
                                    break;
                                case "User":
                                    if (userLocal){ DB.create(userLocal) }
                                    break;
                                default:
                                    break;
                            }
                        }}
                    >
                        <Text>Create</Text>
                    </Pressable>
                    <Pressable
                        style={styles.pressable}
                        onPress={async ()=>{
                            var out
                            switch(selectedTable){
                                case "Ingredient":
                                    out = await DB.readIngredient(0)
                                    setLog(JSON.stringify(out))
                                    console.log(out)
                                    break;
                                case "Category":
                                    out = await DB.readCategory(0)
                                    setLog(JSON.stringify(out))
                                    console.log(out)
                                    break;
                                case "Meal":
                                    out = await DB.readMeal(0)
                                    setLog(JSON.stringify(out))
                                    console.log(out)
                                    break;
                                case "User":
                                    out = await DB.readUser(0)
                                    setLog(JSON.stringify(out))
                                    console.log(out)
                                    break;
                                default:
                                    break;
                            }
                        }}
                    >
                        <Text>Read by id</Text>
                    </Pressable>
                    <Pressable
                        style={styles.pressable}
                        onPress={async ()=>{
                            var out
                            switch(selectedTable){
                                case "Ingredient":
                                    out = await DB.readIngredient("Food")
                                    setLog(JSON.stringify(out))
                                    console.log(out)
                                    break;
                                case "Category":
                                    out = await DB.readCategory("Vegitable")
                                    setLog(JSON.stringify(out))
                                    console.log(out)
                                    break;
                                case "Meal":
                                    out = await DB.readMeal("Pizza")
                                    setLog(JSON.stringify(out))
                                    console.log(out)
                                    break;
                                case "User":

                                    break;
                                default:
                                    break;
                            }
                        
                        }}
                    >
                        <Text>Read by name</Text>
                    </Pressable>
                    <Pressable
                        style={styles.pressable}
                        onPress={async ()=>{
                            var out
                            switch(selectedTable){
                                case "Ingredient":
                                    out = await DB.readAllIngredient()
                                    setLog(JSON.stringify(out))
                                    console.log(out)
                                    break;
                                case "Category":
                                    out = await DB.readAllCategory()
                                    setLog(JSON.stringify(out))
                                    console.log(out)
                                    break;
                                case "Meal":
                                    out = await DB.readAllMeal()
                                    setLog(JSON.stringify(out))
                                    console.log(out)
                                    break;
                                case "User":
                                    out = await DB.readAllUser()
                                    setLog(JSON.stringify(out))
                                    console.log(out)
                                    break;
                                default:
                                    break;
                            }
                        }}
                    >
                        <Text>Read all</Text>
                    </Pressable>
                    <Pressable
                        style={styles.pressable}
                        onPress={()=>{
                            switch(selectedTable){
                                case "Ingredient":
                                    if (ing != undefined){
                                        ing.quantity ++;
                                        console.log(ing)
                                        setLog(JSON.stringify(ing))
                                        DB.updateIngredient(ing)
                                    }
                                    break;
                                case "Category":

                                    break;
                                case "Meal":

                                    break;
                                case "User":

                                    break;
                                default:
                                    break;
                            }
                        
                        }}
                    >
                        <Text>Update</Text>
                    </Pressable>
                    <Pressable
                        style={styles.pressable}
                        onPress={()=>{
                            switch(selectedTable){
                                case "Ingredient":
                                    DB.deleteIngredient(0)
                                    break;
                                case "Category":
                                    DB.deleteCategory(0)
                                    break;
                                case "Meal":
                                    DB.deleteMeal(0)
                                    break;
                                case "User":
                                    DB.deleteUser(0)
                                    break;
                                default:
                                    break;
                            }
                        }}
                    >
                        <Text>Delete by id</Text>
                    </Pressable>
                    <Pressable
                        style={styles.pressable}
                        onPress={()=>{
                            switch(selectedTable){
                                case "Ingredient":
                                    DB.deleteIngredient("Food")
                                    break;
                                case "Category":
                                    DB.deleteCategory("Vegitable")
                                    break;
                                case "Meal":
                                    DB.deleteMeal("Pizza")
                                    break;
                                case "User":
                                    break;
                                default:
                                    break;
                            }
                        }}
                    >
                        <Text>Delete by name</Text>
                    </Pressable>
                    <Pressable
                        style={styles.pressable}
                        onPress={()=>{
                            switch(selectedTable){
                                case "Ingredient":
                                    DB.deleteAllIngredient();
                                    break;
                                case "Category":
                                    DB.deleteAllCategory();
                                    break;
                                case "Meal":
                                    DB.deleteAllMeal();
                                    break;
                                case "User":
                                    DB.deleteAllUser();
                                    break;
                                default:
                                    break;
                            }
                        }}
                    >
                        <Text>Delete all</Text>
                    </Pressable>
                    <Pressable
                        style={styles.pressable}
                        onPress={()=>{
                            DB.deleteFile(true);
                        }}
                    >
                        <Text>Delete file</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    pressable: {
        margin: SPACING.small,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.small,
        paddingHorizontal: SPACING.small,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: COLOURS.primary,
    },
});