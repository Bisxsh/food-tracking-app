import { Ingredient, weightUnit } from "../classes/IngredientClass";
import { Nutrition } from "../classes/NutritionClass";


//need to add date and categories, perhaps a bit redundant ince you could just directly make the object from the inputs
export function AddIngredient(name: string, weight: number, weightType: weightUnit, 
    quantity: number, imgSrc: string, nutrition: Nutrition, id: number){
    
        /*
        names = database.read(name)
        if name in names:
            let user know this is a duplicate item and which item expires first?

        if expiryDate < todays date:
            return false
        */
        let newIngredient = new Ingredient(name, weight, weightType, quantity, imgSrc, nutrition, id);
        console.log(newIngredient);
        //database create(newIngredient: Ingredient)
}
