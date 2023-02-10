import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import * as DB from '../backends/Database'
import { Ingredient } from '../backends/Ingredient';
import { Nutrition } from '../backends/Nutrition';


export function Profile(): JSX.Element {
  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // Use for debugging
  const debug = true;
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
    <View
      style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}>
      <Text>This is Profile page</Text>
    </View>
  );
}
