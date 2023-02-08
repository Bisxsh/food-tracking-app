import React, { useState } from 'react';
import {Text, View, Button} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import * as DB from '../backends/Database'
import { Ingredient } from '../backends/Ingredient';
import { Nutrition } from '../backends/Nutrition';

export function Home(): JSX.Element {
  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  var ing: Ingredient;

  return (
    <View
      style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}>
      <Text>This is Home page</Text>
      <Button
        title='Open file'
        onPress={()=>{
          DB.init()
        }}
      />
      <Button 
        title='Instantiate'
        onPress={()=>{
          if (ing == undefined){
            ing = new Ingredient(1,"g",new Nutrition(),1)
          }
          console.log(ing)
        }}
      />
      <Button
        title='Create record'
        onPress={()=>{
          DB.create(ing)
        }}
      />
      <Button
        title='Read record'
        onPress={async ()=>{
          console.log(await DB.readIngredient(0))
        }}
      />
      <Button 
        title='Delete File'
        onPress={()=>{
          DB.deleteFile();
        }}
      />
    </View>
  );
}
