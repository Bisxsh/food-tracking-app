import React, {useContext, useState} from 'react';
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Button, Text, View } from 'react-native';
import { Picker } from "@react-native-picker/picker";


import * as DB from '../../../backends/Database'
import { Ingredient } from "../../../backends/Ingredient";
import { Nutrition } from "../../../backends/Nutrition";
import { Category } from "../../../backends/Category";
import { User, UserContext } from '../../../backends/User';

export function Debug(): JSX.Element{
    const [ing, setIng] = useState<Ingredient>();
    const [cat, setCat] = useState<Category>();
    const [userLocal, setUserLocal] = useState<User>();
    const { user, setUser } = useContext(UserContext);
    const [selectedTable, setSelectedTable] = useState<string>("Ingredient");
    const isDarkMode = user.setting.isDark()

    return (
        <View 
            style={{
                flexDirection: "row",
                flex: 1,
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
                <Text>Select table</Text>
                <Picker
                    selectedValue={selectedTable}
                    onValueChange={(value, index)=>{setSelectedTable(value)}}
                    style={{
                        alignSelf:"stretch"
                    }}
                >
                    <Picker.Item label="Ingredient" value="Ingredient"/>
                    <Picker.Item label="Category" value="Category"/>
                    <Picker.Item label="User" value="User"/>
                </Picker>
            </View>
            <View
                style={{
                    backgroundColor: isDarkMode ? Colors.darker : Colors.white,
                    flex: 1,
                    justifyContent: "space-around",
                    alignItems: "flex-start",
                    alignContent: "flex-start"
                }}
            >
                <Button
                    title='Open DB'
                    onPress={()=>{
                        DB.init();
                    }}
                />
                <Button
                    title='Instantiate'
                    onPress={()=>{
                        switch(selectedTable){
                            case "Ingredient":
                                const newIng = new Ingredient("Food", 1, "g", new Nutrition(), 1);
                                setIng(newIng)
                                console.log(newIng)
                                break;
                            case "Category":
                                const newCat = new Category("Vegitable", "#00FF00");
                                setCat(newCat)
                                console.log(newCat)
                                break;
                            case "User":
                                const newUser = new User("Hello Welcome")
                                setUserLocal(newUser)
                                console.log(newUser)
                                break;
                            default:
                                break;
                        }
                    }}
                />
                <Button
                    title='Create'
                    onPress={()=>{
                        switch(selectedTable){
                            case "Ingredient":
                                if (ing){ DB.create(ing) }
                                break;
                            case "Category":
                                if (cat){ DB.create(cat) }
                                break;
                            case "User":
                                if (userLocal){ DB.create(userLocal) }
                                break;
                            default:
                                break;
                        }
                    }}
                />
                <Button
                    title='Read by id'
                    onPress={async ()=>{
                        switch(selectedTable){
                            case "Ingredient":
                                console.log(await DB.readIngredient(0))
                                break;
                            case "Category":
                                console.log(await DB.readCategory(0))
                                break;
                            case "User":
                                console.log(await DB.readUser(0))
                                break;
                            default:
                                break;
                        }
                    }}
                />
                <Button
                    title='Read by name'
                    onPress={async ()=>{
                        switch(selectedTable){
                            case "Ingredient":
                                console.log(await DB.readIngredient("Food"))
                                break;
                            case "Category":
                                console.log(await DB.readCategory("Vegitable"))
                                break;
                            case "User":

                                break;
                            default:
                                break;
                        }
                    
                    }}
                />
                <Button
                    title='Read all'
                    onPress={async ()=>{
                        switch(selectedTable){
                            case "Ingredient":
                                console.log(await DB.readAllIngredient())
                                break;
                            case "Category":
                                console.log(await DB.readAllCategory())
                                break;
                            case "User":
                                console.log(await DB.readAllUser())
                                break;
                            default:
                                break;
                        }
                    }}
                />
                <Button
                    title='Update'
                    onPress={()=>{
                        switch(selectedTable){
                            case "Ingredient":
                                if (ing != undefined){
                                    ing.quantity ++;
                                    console.log(ing)
                                    DB.updateIngredient(ing)
                                }
                                break;
                            case "Category":

                                break;
                            case "User":

                                break;
                            default:
                                break;
                        }
                    
                    }}
                />
                <Button
                    title='Delete by id'
                    onPress={()=>{
                        switch(selectedTable){
                            case "Ingredient":
                                DB.deleteIngredient(0)
                                break;
                            case "Category":
                                DB.deleteCategory(0)
                                break;
                            case "User":
                                DB.deleteUser(0)
                                break;
                            default:
                                break;
                        }
                    }}
                />
                <Button
                    title='Delete by name'
                    onPress={()=>{
                        switch(selectedTable){
                            case "Ingredient":
                                DB.deleteIngredient("Food")
                                break;
                            case "Category":
                                DB.deleteCategory("Vegitable")
                                break;
                            case "User":
                                break;
                            default:
                                break;
                        }
                    }}
                />
                <Button
                    title='Delete all'
                    onPress={()=>{
                        switch(selectedTable){
                            case "Ingredient":
                                DB.deleteAllIngredient();
                                break;
                            case "Category":
                                DB.deleteAllCategory();
                                break;
                            case "User":
                                DB.deleteAllUser();
                                break;
                            default:
                                break;
                        }
                    }}
                />
                <Button
                    title='Delete file'
                    onPress={()=>{
                        DB.deleteFile(true);
                    }}
                />
            </View>
        </View>
        
    );
  

}