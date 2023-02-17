import * as sq from "expo-sqlite";
import * as FileSystem from 'expo-file-system';

import { Ingredient } from "./Ingredient";
import { Category } from "./Category";
import { User } from "./User";
import { Meal } from "./Meal";


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
        nutrition: "ntext not null",
        categoryId: "text",
        barcode: "int",
        memo: "ntext",
    },
};

const CategorySchema: Schema = {
    name: "Category",
    properties: {
        _id: "int primary key not null",
        name: "ntext not null",
        colour: "text not null",
        active: "boolean",
    },
};

const UserSchema: Schema = {
    name: "User",
    properties: {
        _id: "int primary key not null",
        name: "ntext not null",
        imgSrc: "ntext",
        dateOfReg: "date",
        dietReq: "ntext not null",
        setting: "ntext not null",
    }
}

// Probably not needed
const SettingSchema: Schema = {
    name: "Setting",
    properties: {
        _id: "int primary key not null",
        useId: "int not null",
        notification: "boolean",
        appearance: "int not null",
        debug: "boolean"
    }
}

const HistorySchema: Schema = {
    name: "History",
    properties: {
        _id: "int primary key not null",
        userId: "int not null",
        date: "date not null",
        waste: "real not null",
        cost: "real not null"
    }
}

// Probably not needed
const NutritionSchema: Schema = {
    name: "Nutrition",
    properties: {
        _id: "int primary key not null",
        carbs: "real not null",
        carbsUnit: "ntext not null",
        energy: "real not null",
        energyUnit: "ntext not null",
        protein: "real not null",
        proteinUnit: "ntext not null",
        fat: "real not null",
        fatUnit: "ntext not null",
        saturatedFat: "real not null",
        saturatedFatUnit: "ntext not null",
        fibre: "real not null",
        fibreUnit: "ntext not null",
        salt: "real not null",
        saltUnit: "ntext not null",
        sugar: "real not null",
        sugarUnit: "ntext not null",
    },
};

const MealSchema: Schema = {
    name: "Meal",
    properties: {
        _id: "int primary key not null",
        name: "ntext not null",
        url: "ntext",
        imgSrc: "ntext",
        categoryId: "text",
        instruction: "ntext",
    }
}

// ======== Basic Operation on DB ==============================================================

function openDB(): sq.WebSQLDatabase{
    const db = sq.openDatabase("DB.db", "v6")
    db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>{});
    return db
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
        (reason?:any) => {console.log('FAIL: SQL Execution\n' + reason)},
        () => {if (verbose) {console.log('SUCCESS: SQL Execution')}}
        )
    })

    result = (await promise) as sq.SQLResultSet

    return result;
}

// ======== Create tables ==============================================================

async function createTable(schema: Schema){
    var sql:string = "create table if not exists " + schema.name + " ("

    for (const key of Object.keys(schema.properties)){
        sql = sql + key + " " + schema.properties[key] + ", "
    }

    sql = sql.substring(0, sql.length -2) + ");"

    await transaction(sql, [], "Create table")
}

export async function init(){
    await createTable(CategorySchema);
    await createTable(UserSchema);
    await createTable(IngredientSchema);
    await createTable(MealSchema);
}

// ======== Create records ==============================================================

export function create(ingredient:Ingredient):any

export function create(category: Category):any

export function create(user: User): any

export function create(meal: Meal): any

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
    }else if (value instanceof User){
        const arg = value.toList()
        sql = "insert or ignore into " + UserSchema.name + " values (" + "?,".repeat(arg.length).substring(0, arg.length*2 -1) + ");"
        transaction(sql, arg, "Insert record")
    }else if (value instanceof Meal){
        const arg = value.toList()
        sql = "insert or ignore into " + MealSchema.name + " values (" + "?,".repeat(arg.length).substring(0, arg.length*2 -1) + ");"
        transaction(sql, arg, "Insert record")
    }
}

// ======== Create records ==============================================================

async function readAll(schema: Schema, property?:string, arg?: any, partial=false): Promise<Object[]>{
    var sql: string = "select * from " + schema.name
    var result
    if (property != undefined && arg != undefined){
        sql = sql + " where "+ property + ((partial)? " like '%"+arg+"%';": " = ?;")
        console.log(sql)
        result = await transaction(sql, (partial)? []: [arg], "Select record")
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

export async function readIngredient(category: Category):Promise<Ingredient[]|[]>

export async function readIngredient(value: any): Promise<any>{

    switch(typeof(value)){
        case "number":
            const row = await read(IngredientSchema, "_id", value);
            if (row != undefined){
                return Ingredient.fromList(Object.values(row));
            }
            break;
        case "string":
            const rows = await readAll(IngredientSchema, "name", value, true);
            const ings: Ingredient[] = [];
            for (const row of rows){
                ings.push(Ingredient.fromList(Object.values(row)));
            }
            return ings;
        default:
            if (value instanceof Category){
                const rows = await readAll(IngredientSchema, "categoryId", ","+value._id+",", true);
                const ings: Ingredient[] = [];
                for (const row of rows){
                    ings.push(Ingredient.fromList(Object.values(row)));
                }
            }
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
            const cats: Category[] = [];
            for (const row of rows){
                cats.push(Category.fromList(Object.values(row)));
            }
            return cats;
        default:
            break;
    }

    return;
}

export async function readAllCategory():Promise<Category[]>{
    const rows: Object[] = await readAll(CategorySchema);
    const cats: Category[] = [];

    for (const row of rows){
        cats.push(Category.fromList(Object.values(row)));
    }
    
    return cats;
}

export async function readUser(id: number):Promise<User|undefined>

//export async function readUser(name: string):Promise<User[]|[]>

export async function readUser(value: any): Promise<any>{

    switch(typeof(value)){
        case "number":
            const row = await read(UserSchema, "_id", value);
            if (row != undefined){
                return User.fromList(Object.values(row));
            }
            break;
        case "string":
            const rows = await readAll(UserSchema, "name", value);
            const users: User[] = [];
            for (const row of rows){
                users.push(User.fromList(Object.values(row)));
            }
            return users;
        default:
            break;
    }

    return;
}

export async function readAllUser():Promise<User[]>{
    const rows: Object[] = await readAll(UserSchema);
    const users: User[] = [];

    for (const row of rows){
        users.push(User.fromList(Object.values(row)));
    }
    
    return users;
}

export async function readMeal(id: number):Promise<Meal|undefined>

export async function readMeal(name: string):Promise<Meal[]|[]>

export async function readMeal(value: any): Promise<any>{

    switch(typeof(value)){
        case "number":
            const row = await read(MealSchema, "_id", value);
            if (row != undefined){
                return Meal.fromList(Object.values(row));
            }
            break;
        case "string":
            const rows = await readAll(MealSchema, "name", value);
            const cats: Meal[] = [];
            for (const row of rows){
                cats.push(Meal.fromList(Object.values(row)));
            }
            return cats;
        default:
            break;
    }

    return;
}

export async function readAllMeal():Promise<Meal[]>{
    const rows: Object[] = await readAll(MealSchema);
    const cats: Meal[] = [];

    for (const row of rows){
        cats.push(Meal.fromList(Object.values(row)));
    }
    
    return cats;
}

// ======== Update records ==============================================================

export function updateIngredient(ingredient: Ingredient){
    const arg = ingredient.toList().slice(1, -1)
    var sql: string = "update " + IngredientSchema.name + " set "
    for (const key of Object.keys(IngredientSchema.properties).slice(1,-1)){
        sql = sql + key + " = ?, "
    }
    sql = sql.substring(0, sql.length -2) + ";"
    transaction(sql, arg, "Update record")
}

export function updateCategory(Category: Category){
    const arg = Category.toList().slice(1, -1)
    var sql: string = "update " + CategorySchema.name + " set "
    for (const key of Object.keys(CategorySchema.properties).slice(1,-1)){
        sql = sql + key + " = ?, "
    }
    sql = sql.substring(0, sql.length -2) + ";"
    transaction(sql, arg, "Update record")
}

export function updateUser(User: User){
    const arg = User.toList().slice(1, -1)
    var sql: string = "update " + UserSchema.name + " set "
    for (const key of Object.keys(UserSchema.properties).slice(1,-1)){
        sql = sql + key + " = ?, "
    }
    sql = sql.substring(0, sql.length -2) + ";"
    transaction(sql, arg, "Update record")
}

export function updateMeal(Meal: Meal){
    const arg = Meal.toList().slice(1, -1)
    var sql: string = "update " + MealSchema.name + " set "
    for (const key of Object.keys(MealSchema.properties).slice(1,-1)){
        sql = sql + key + " = ?, "
    }
    sql = sql.substring(0, sql.length -2) + ";"
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

export function deleteUser(_id: number):any

//export function deleteUser(name: string):any

export function deleteUser(value: any){
    var sql: string = "delete from " + UserSchema.name + " where "
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

export function deleteAllUser(){
    const sql: string = "delete from " + UserSchema.name
    transaction(sql, [], "Delete all record")
}

export function deleteMeal(_id: number):any

export function deleteMeal(name: string):any

export function deleteMeal(value: any){
    var sql: string = "delete from " + MealSchema.name + " where "
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

export function deleteAllMeal(){
    const sql: string = "delete from " + MealSchema.name
    transaction(sql, [], "Delete all record")
}

// ======== Delete DB file ==============================================================

export async function deleteFile(verbose=false){
    const dir:string[] = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory+"/SQLite/")
    if (dir.indexOf("DB.db") != -1){
        for (const file of dir){
            await FileSystem.deleteAsync(FileSystem.documentDirectory+"/SQLite/"+file)
        }
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
