import * as sq from "expo-sqlite";
import * as FileSystem from 'expo-file-system';

import { Ingredient } from "./Ingredient";
import { Category } from "./Category";
import { Nutrition } from "./Nutrition";



interface Schema {
    name: string,
    properties: any,
}

// Configuration of tables
const IngredientSchema: Schema = {
    name: "Ingredient",
    properties: {
        _id: "int primary key not null",
        name: "ntext not null",
        quantity: "int not null",
        weight: "int",
        weightUnit: "ntext not null",
        imgSrc: "ntext",
        useDate: "date",
        expiryDate: "date",
        nutrition: "text not null",
        categoryId: "int not null",
    },
};

const CategorySchema: Schema = {
    name: "Category",
    properties: {
        _id: "int primary key not null",
        name: "ntext not null",
        colour: "text not null",
        active: "bool",
    },
};

const NutritionSchema: Schema = {
    name: "Nutrition",
    properties: {
        _id: "objectId",
        carbs: "float?",
        carbsUnit: "str",
        energy: "float?",
        energyUnit: "str",
        protein: "float?",
        proteinUnit: "str",
        fat: "float?",
        fatUnit: "str",
        saturatedFat: "float?",
        saturatedFatUnit: "str",
        fibre: "float?",
        fibreUnit: "str",
        salt: "float?",
        saltUnit: "str",
        sugar: "float?",
        sugarUnit: "str",
    },
};

// ======== Basic Operation on DB ==============================================================

function openDB(): sq.WebSQLDatabase{
    return sq.openDatabase("DB.db", "v3")
}

async function transaction(sql:string, arg:any[], description?:string, verbose = true):Promise<sq.SQLResultSet | undefined>{
    var db = openDB()
    var result: sq.SQLResultSet | undefined;
    
    const promise = new Promise(resolve => {
        db.transaction(tx => {
            tx.executeSql(
                sql,
                arg,
                (_, out) => {
                    if (verbose){
                        console.log('SUCCESS: ' + description);
                    }
                    resolve(out)
                },
                () => {
                    console.log('FAIL: ' + description);
                    return true;
                },
            );
        },
        () => {console.log('FAIL: SQL Execution')},
        () => {if (verbose) {console.log('SUCCESS: SQL Execution')}}
        )
    })

    result = (await promise) as sq.SQLResultSet

    return result;
}

// ======== Create tables ==============================================================

function createTable(schema: Schema){
    var sql:string = "create table if not exists " + schema.name + " ("

    for (const key of Object.keys(schema.properties)){
        sql = sql + key + " " + schema.properties[key] + ", "
    }

    sql = sql.substring(0, sql.length -2) + ");"

    transaction(sql, [], "Create table")
}

export function init(){
    createTable(IngredientSchema);
    createTable(CategorySchema);
}

// ======== Create records ==============================================================

export function create(ingredient:Ingredient):any

export function create(category: Category):any

export function create(value: any){
    var sql: string;
    if (value instanceof  Ingredient){
        const arg = value.toList()
        sql = "insert into " + IngredientSchema.name + " values (" + "?,".repeat(arg.length).substring(0, arg.length*2 -1) + ");"
        transaction(sql, arg, "Insert record")
    }else if (value instanceof Category){
        const arg = value.toList()
        sql = "insert into " + CategorySchema.name + " values (" + "?,".repeat(arg.length).substring(0, arg.length*2 -1) + ");"
        transaction(sql, arg, "Insert record")
    }else if (value instanceof Nutrition){

    }
}

// ======== Create records ==============================================================

async function readAll(schema: Schema, property?:string, arg?: any): Promise<Object[]>{
    var sql: string = "select * from " + schema.name
    var result
    if (property != undefined && arg != undefined){
        sql = sql + " where "+ property +" = ?;"
        result = await transaction(sql, [arg], "Select record")
    }else{
        sql += ";"
        result = await transaction(sql, [], "Select record")
    }
    
    if (result == undefined){
        throw Error("Table doesn't exist");
    }
    
    return result.rows._array;
}

async function read(schema: Schema, property:string, arg: any):Promise<Object|undefined>{
    var sql: string = "select * from " + schema.name + " where "+ property +" = ?;"
    const result = await transaction(sql, [arg], "Select record")
    
    if (result == undefined){
        throw Error("Table doesn't exist");
    }else if(result.rows.length == 0){
        return;
    }
    
    return result.rows.item(0);
}


export async function readIngredient(id: number):Promise<Ingredient|undefined>

export async function readIngredient(name: string):Promise<Ingredient[]|[]>

export async function readIngredient(value: any): Promise<any>{

    switch(typeof(value)){
        case "number":
            const row = await read(IngredientSchema, "_id", value);
            if (row != undefined){
                return Ingredient.fromList(Object.values(row));
            }
            break;
        case "string":
            const rows = await readAll(IngredientSchema, "name", value);
            const ings: Ingredient[] = [];
            for (const row of rows){
                ings.push(Ingredient.fromList(Object.values(row)));
            }
            return ings;
        default:
            break;
    }

    return;
}

export async function readAllIngredient():Promise<Ingredient[]>{
    const rows: Object[] = await readAll(IngredientSchema);
    const ings: Ingredient[] = [];

    for (const row of rows){
        ings.push(Ingredient.fromList(Object.values(row)));
    }
    
    return ings;
}

export async function readCategory(id: number):Promise<Category|undefined>

export async function readCategory(name: string):Promise<Category[]|[]>

export async function readCategory(value: any): Promise<any>{

    switch(typeof(value)){
        case "number":
            const row = await read(CategorySchema, "_id", value);
            if (row != undefined){
                return Category.fromList(Object.values(row));
            }
            break;
        case "string":
            const rows = await readAll(CategorySchema, "name", value);
            const ings: Category[] = [];
            for (const row of rows){
                ings.push(Category.fromList(Object.values(row)));
            }
            return ings;
        default:
            break;
    }

    return;
}

export async function readAllCategory():Promise<Category[]>{
    const rows: Object[] = await readAll(CategorySchema);
    const ings: Category[] = [];

    for (const row of rows){
        ings.push(Category.fromList(Object.values(row)));
    }
    
    return ings;
}

// ======== Update records ==============================================================

export function updateIngredient(ingredient: Ingredient){
    const arg = ingredient.toList().slice(1, -1)
    var sql: string = "update " + IngredientSchema.name + " set "
    for (const key of Object.keys(IngredientSchema.properties).slice(1,-1)){
        sql = sql + key + " = ?, "
    }
    sql = sql.substring(0, sql.length -2) + ";"
    console.log(sql)
    transaction(sql, arg, "Update record")
}

export function updateCategory(Category: Category){
    const arg = Category.toList().slice(1, -1)
    var sql: string = "update " + CategorySchema.name + " set "
    for (const key of Object.keys(CategorySchema.properties).slice(1,-1)){
        sql = sql + key + " = ?, "
    }
    sql = sql.substring(0, sql.length -2) + ";"
    console.log(sql)
    transaction(sql, arg, "Update record")
}

// ======== Delete records ==============================================================

export function deleteIngredient(_id: number):any

export function deleteIngredient(name: string):any

export function deleteIngredient(value: any){
    var sql: string = "delete from " + IngredientSchema.name + " where "
    switch(typeof(value)){
        case "number":
            sql = sql + "_id = ?;"
            transaction(sql, [value], "Delete record")
            break;
        case "string":
            sql = sql + "name = ?;"
            transaction(sql, [value], "Delete record")
            break;
        default:
            break;
    }
}

export function deleteAllIngredient(){
    const sql: string = "delete from " + IngredientSchema.name
    transaction(sql, [], "Delete all record")
}

export function deleteCategory(_id: number):any

export function deleteCategory(name: string):any

export function deleteCategory(value: any){
    var sql: string = "delete from " + CategorySchema.name + " where "
    switch(typeof(value)){
        case "number":
            sql = sql + "_id = ?;"
            transaction(sql, [value], "Delete record")
            break;
        case "string":
            sql = sql + "name = ?;"
            transaction(sql, [value], "Delete record")
            break;
        default:
            break;
    }
}

export function deleteAllCategory(){
    const sql: string = "delete from " + CategorySchema.name
    transaction(sql, [], "Delete all record")
}

// ======== Delete DB file ==============================================================

export async function deleteFile(verbose=false){
    const dir:string[] = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory+"/SQLite/")

    if (dir.indexOf("DB.db") != -1){
        await FileSystem.deleteAsync(FileSystem.documentDirectory+"/SQLite/DB.db")
        await FileSystem.deleteAsync(FileSystem.documentDirectory+"/SQLite/DB.db-journal")
        if (verbose){
            if ((await FileSystem.readDirectoryAsync(FileSystem.documentDirectory+"/SQLite/")).length == 0){
                console.log("SUCCESS: Delete file")
            }else{
                console.log("FAIL: Delete file")
            }
        }
    }else{
        if (verbose){
            console.log("FAIL: Delete file (No such file)")
        }
    }
}
