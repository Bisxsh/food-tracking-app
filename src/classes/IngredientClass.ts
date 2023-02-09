// import { Nutrition } from "./NutritionClass";

// export enum weightUnit {
//     kg,
//     grams,
//   }

// export enum categories {
//     kg,
//     grams,
//   }

// export class Ingredient {
//     name: string;
//     weight: number;
//     weightType: weightUnit;
//     quantity: number;
//     categories: categories;
//     imgSrc: string;
//     useDate: Date;
//     expiryDate: Date;
//     nutrition: Nutrition;
//     id: number;


//     constructor(name: string, weight: number, weightType: weightUnit, quantity: number, categories: categories, imgSrc: string,
//         expiryDate: Date, useDate: Date, nutrition: Nutrition, id: number) {
//         this.name = name;
//         this.weight = weight;
//         this.weightType = weightType;
//         this.quantity = quantity;
//         this.categories = categories;
//         this.imgSrc = imgSrc;
//         this.useDate = useDate;
//         this.expiryDate = expiryDate;
//         this.nutrition = nutrition;
//         this.id = id;
//         }


//     //#region getters and setters

//     public get getName() : string {
//         return this.name;
//     }
//     public set setName(name : string) {
//         this.name = name;
//     }

//     public get getWeight() : number {
//         return this.weight;
//     }
//     public set setWeight(weight : number) {
//         this.weight = weight;
//     }

//     public get getWeightType() : weightUnit {
//         return this.weightType;
//     }
//     public set setWeightType(weightType : weightUnit) {
//         this.weightType = weightType;
//     }

//     public get getQuantity() : number {
//         return this.quantity;
//     }
//     public set setQuantity(quantity : number) {
//         this.quantity = quantity;
//     }

//     public get getImgSrc() : string {
//         return this.imgSrc;
//     }
//     public set setImgSrc(imgSrc : string) {
//         this.imgSrc = imgSrc;
//     }

//     public get getNutrition() : Nutrition {
//         return this.nutrition;
//     }
//     public set setnutrition(nutrition : Nutrition) {
//         this.nutrition = nutrition;
//     }

//     public get getId() : number {
//         return this.id;
//     }
//     public set setId(id : number) {
//         this.id = id;
//     }
//     //#endregion
// }