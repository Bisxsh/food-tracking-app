import { MaterialIcons } from '@expo/vector-icons';
import React, {useState} from 'react';
import {Button, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import {Colors} from 'react-native/Libraries/NewAppScreen';

import * as DB from '../../backends/Database'
import { Ingredient } from '../../backends/Ingredient';
import { Nutrition } from '../../backends/Nutrition';
import { COLOURS, ICON_SIZES, SPACING } from '../../util/GlobalStyles';


export function Profile(): JSX.Element {
  const navigation = useNavigation<any>();
  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // Use for debugging
  const debug = false;
  const [ing, setIng] = useState<Ingredient>();
  if (debug){
    return (
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          flex: 1,
          justifyContent: "space-around",
          alignItems: "center"
        }}>
        <View/>
        <Text>This is Profile page in debug mode</Text>
        <Button
          title='Open DB'
          onPress={()=>{
            DB.init();
          }}
        />
        <Button
         title='Instantiate'
         onPress={()=>{
          const newIng = new Ingredient("Food", 1, "g", new Nutrition(), 1);
          setIng(newIng)
          console.log(newIng)
         }}
        />
        <Button
          title='Create'
          onPress={()=>{
            if (ing){
              DB.create(ing);
            }
          }}
        />
        <Button
          title='Read by id'
          onPress={async ()=>{
            console.log(await DB.readIngredient(0))
          }}
        />
        <Button
          title='Read by name'
          onPress={async ()=>{
            console.log(await DB.readIngredient("Food"))
          }}
        />
        <Button
          title='Read all'
          onPress={async ()=>{
            console.log(await DB.readAllIngredient())
          }}
        />
        <Button
          title='Update'
          onPress={()=>{
            if (ing != undefined){
              ing.quantity ++;
              console.log(ing)
              DB.updateIngredient(ing)
            }
          }}
        />
        <Button
          title='Delete by id'
          onPress={()=>{
            DB.deleteIngredient(0)
          }}
        />
        <Button
          title='Delete by name'
          onPress={()=>{
            DB.deleteIngredient("Food")
          }}
        />
        <Button
          title='Delete all'
          onPress={()=>{
            DB.deleteAllIngredient();
          }}
        />
        <Button
          title='Delete file'
          onPress={()=>{
            DB.deleteFile(true);
          }}
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
        }}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            flexDirection: "row",
            justifyContent: "flex-end",
            margin: SPACING.small,
          }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
            }}
            onPress={()=>{
              navigation.navigate("Setting", {})
            }}
          >
            <MaterialIcons name="settings" color={COLOURS.black} size={ICON_SIZES.medium} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "stretch",
            alignContent: "center",
          }}
        >
          <ScrollView
            style={{
              flexDirection: "column",
            }}
            contentContainerStyle={{
              flexGrow: 1
            }}
          >
            <View
              style={{
                backgroundColor: isDarkMode ? Colors.black : Colors.white,
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Text>This is Profile page</Text>
            </View>
          </ScrollView>
        </View>
        
      </View>
    </SafeAreaView>
  );
}
