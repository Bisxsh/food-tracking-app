import { Ingredient } from "../backends/Ingredient";
import { Nutrition } from "../backends/Nutrition";
import { create } from "../backends/Database"

//need to add date and categories, perhaps a bit redundant ince you could just directly make the object from the inputs
export function AddIngredient(id: number, weightType: string, nutrition: Nutrition, categoryId: number, _id?: number, 
    weight?: number, imgSrc?: string, useDate?: Date, expiryDate?: Date ){
    
        /*
        names = database.read(name)
        if name in names:
            let user know this is a duplicate item and which item expires first?

        if expiryDate < todays date:
            return false
        */
        let newIngredient = new Ingredient(id, weightType, nutrition, categoryId, _id, weight, imgSrc, useDate, expiryDate);
        console.log(newIngredient);
        create(newIngredient);
}
