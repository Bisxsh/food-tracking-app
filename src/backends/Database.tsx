import * as sq from "expo-sqlite";
import * as FileSystem from 'expo-file-system';

import { Ingredient } from "./Ingredient";

interface Schema {
    name: string,
    properties: any,
}

const IngredientSchema: Schema = {
    name: "Ingredient",
    properties: {
        _id: "int primary key not null",
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
        _id: "objectId",
        name: "str"
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


function openDB(): sq.WebSQLDatabase{
    return sq.openDatabase("DB.db", "v2")
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

function createTable(schema: Schema){
    var sql:string = "create table if not exists " + schema.name + " ("

    for (const key of Object.keys(schema.properties)){
        sql = sql + key + " " + schema.properties[key] + ", "
    }

    sql = sql.substring(0, sql.length -2) + ");"

    transaction(sql, [], "Create table", true)
}

export function init(){
    createTable(IngredientSchema);
}

export function create(ingredient:Ingredient){
    const arg = ingredient.toList()
    var sql: string = "insert into " + IngredientSchema.name + " values (" + "?,".repeat(arg.length).substring(0, arg.length*2 -1) + ");"
    transaction(sql, arg, "Insert record", true)
}

async function read(schema: Schema, id: number):Promise<Object>{
    var sql: string = "select * from " + schema.name + " where _id = ?;"
    const result = await transaction(sql, [id], "Select record")
    
    if (result == undefined){
        throw Error("Table doesn't exist");
    }else if(result.rows.length == 0){
        throw Error("ID doesn't match");
    }
    
    return result.rows.item(0);
}

export async function readIngredient(id: number):Promise<Ingredient>{
    const row = await read(IngredientSchema, id);
    
    return Ingredient.fromList(Object.values(row));
}

export function deleteAll(){
    const sql: string = "delete from Ingredient"
    transaction(sql, [], "Delete all record", true)
}

export async function deleteFile(){
    const dir:string[] = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory+"/SQLite/")

    if (dir.indexOf("DB.db") != -1){
        await FileSystem.deleteAsync(FileSystem.documentDirectory+"/SQLite/DB.db")
        await FileSystem.deleteAsync(FileSystem.documentDirectory+"/SQLite/DB.db-journal")
    }
}
