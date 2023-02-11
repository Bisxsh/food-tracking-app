import React from "react"
import Axios from 'axios'



const APP_ID = "c86047cc"
const APP_KEY = "a9afdf98df39331609c06cab2fec2b6f"


export const getRecipes = async (ingredient: string) => {
    const url = `https://api.edamam.com/search?q=${ingredient}&app_id=${APP_ID}&app_key=${APP_KEY}`;
    const data = await Axios.get(url);
    return data.data
    // data.data.map((key: string)=> {
    //     console.log(key)
    // })
}