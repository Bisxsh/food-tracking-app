import React, {useContext, useState} from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Picker } from "@react-native-picker/picker";


import * as DB from '../../../backends/Database'
import { Ingredient } from "../../../backends/Ingredient";
import { Nutrition } from "../../../backends/Nutrition";
import { Category } from "../../../backends/Category";
import { User, UserContext } from '../../../backends/User';
import { COLOURS, RADIUS, SPACING } from '../../../util/GlobalStyles';
import { Meal } from '../../../backends/Meal';
import { History } from '../../../backends/Histories';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Dummy from '../../../classes/DummyData'
import { UserDataContext } from '../../../classes/UserData';
import { getCustom, getRecipes, getSaved } from '../../../util/GetRecipe';
import * as IngredientClass from "../../../classes/IngredientClass"


export function Debug(): JSX.Element{
    const [ing, setIng] = useState<Ingredient>();
    const [cat, setCat] = useState<Category>();
    const [meal, setMeal] = useState<Meal>();
    const [history, setHistory] = useState<History>()
    const [userLocal, setUserLocal] = useState<User>();
    const { user, setUser } = useContext(UserContext);
    const { userData, setUserData } = useContext(UserDataContext)
    const [selectedTable, setSelectedTable] = useState<string>("Ingredient");
    const [log, setLog] = useState<string>("");
    const [monthCount, setMonthCount] = useState(1)
    const isDarkMode = user.setting.isDark()


    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
            }}
            edges={['left', 'right']}
        >
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
                            backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
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
                                backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
                            }}
                        >
                            <Picker.Item label="Ingredient" value="Ingredient" style={{color: isDarkMode ? COLOURS.textTouchable : COLOURS.black,}}/>
                            <Picker.Item label="Category" value="Category" style={{color: isDarkMode ? COLOURS.textTouchable : COLOURS.black,}}/>
                            <Picker.Item label="Meal" value="Meal" style={{color: isDarkMode ? COLOURS.textTouchable : COLOURS.black,}}/>
                            <Picker.Item label="History" value="History" style={{color: isDarkMode ? COLOURS.textTouchable : COLOURS.black,}}/>
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
                            backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
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
                            onPress={async ()=>{
                                let categories: {[name:string]:number} = {}
                                for (const i of Dummy.DUMMY_CATEGORIES){
                                    await DB.create(new Category(
                                        i.name,
                                        i.colour,
                                        undefined,
                                        i.active
                                    ))
                                }
                                for (const cat of await DB.readAllCategory()){
                                    categories[cat.name] = cat._id
                                }
                                for (const i of Dummy.DUMMY_STORED_INGREDIENTS) {
                                    await DB.create(new Ingredient(
                                        i.name, 
                                        i.quantity,
                                        i.weightType, 
                                        i.servingSizeType, 
                                        new Nutrition(
                                            undefined, 
                                            i.nutrition.getCarbs, 
                                            undefined,
                                            i.nutrition.getEnergy,
                                            undefined,
                                            i.nutrition.getProtein,
                                            undefined,
                                            i.nutrition.getFat,
                                            undefined,
                                            i.nutrition.getSaturatedFat,
                                            undefined,
                                            i.nutrition.getFibre,
                                            undefined,
                                            i.nutrition.getSalt,
                                            undefined,
                                            i.nutrition.getSugar,
                                            undefined
                                        ), 
                                        i.categories.map((v)=>categories[v.name]), 
                                        i.id, 
                                        i.weight, 
                                        i.servingSize, 
                                        i.imgSrc, 
                                        i.useDate, 
                                        i.expiryDate
                                    ))
                                }
                                for (const i of Dummy.DUMMY_MEALS){
                                    await DB.create(new Meal(
                                        i.name,
                                        i.categoryId,
                                        i.instruction,
                                        [],
                                        i._id,
                                        i.url,
                                        i.imgSrc
                                    ))
                                }
                                var c = monthCount
                                for (let i = 0; i < 100; i++) {
                                    const date = new Date()
                                    date.setMonth(Math.floor(c/2) % 12)
                                    date.setFullYear(date.getFullYear() - Math.floor(Math.floor(c/2)/12))
                                    const newHistory = new History(0, date, Math.random() * 100, Math.random() * 100)
                                    await DB.create(newHistory)
                                    c++
                                }
                                setMonthCount(c)
                                await user.loadCategories()
                                setUser(user)
                                const ing: IngredientClass.Ingredient[] = [];
                                for (const v of (await DB.readAllIngredient())) {
                                    ing.push(await v.toIngredientClass())
                                }
                                setUserData({
                                    ...userData,
                                    ingredientCategories: user.categories.map((v)=>v.toCategoryClass()),
                                    storedIngredients: ing,
                                    exploreRecipes: await getRecipes(), 
                                    savedRecipes: await getSaved(), 
                                    customRecipes: await getCustom()
                                });
                                DB.updateUser(user)
                            }}
                        >
                            <Text>Load Dummy Data</Text>
                        </Pressable>
                        <Pressable
                            style={styles.pressable}
                            onPress={()=>{
                                switch(selectedTable){
                                    case "Ingredient":
                                        const newIng = new Ingredient("Food", 1, "g", "g", new Nutrition(), []);
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
                                        const newMeal = new Meal("Pizza", [], ["Heat for 20 mins in 200℃ oven"], (ing != undefined)? [ing]: [])
                                        setMeal(newMeal)
                                        setLog(JSON.stringify(newMeal))
                                        console.log(newMeal)
                                        break;
                                    case "History":
                                        const date = new Date()
                                        date.setMonth(Math.floor(monthCount/2) % 12)
                                        date.setFullYear(date.getFullYear() - Math.floor(Math.floor(monthCount/2)/12))
                                        const newHistory = new History(0, date, Math.random() * 100, Math.random() * 100)
                                        setHistory(newHistory)
                                        setLog(JSON.stringify(newHistory))
                                        console.log(newHistory )
                                        setMonthCount(monthCount + 1)
                                        console.log(monthCount)
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
                                    case "History":
                                        if (history){ DB.create(history) }
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
                                    case "History":
                                        out = await DB.readHistory(0)
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
                                    case "History":
                                        out = await DB.readAllHistory()
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
                            onPress={async ()=>{
                                switch(selectedTable){
                                    case "Ingredient":
                                        if (ing != undefined){
                                            ing.quantity --;
                                            console.log(ing)
                                            setLog(JSON.stringify(ing))
                                            DB.updateIngredient(ing)
                                        }
                                        break;
                                    case "Category":

                                        break;
                                    case "Meal":

                                        break;
                                    case "History":
                                        break;
                                    case "User":
                                        const u = await DB.readUser(0)
                                        if (u != undefined){
                                            u.consent = !u.consent
                                            u.name += "#"
                                            console.log(u)
                                            setLog(JSON.stringify(u))
                                            DB.updateUser(u)
                                        }
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
                                    case "History":
                                        DB.deleteHistory(0)
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
                                    case "History":
                                        DB.deleteAllHistory();
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
        </SafeAreaView>
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