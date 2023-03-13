import * as CategoryClass from "../classes/Categories"

export class Category{
    _id!: number
    name: string
    colour: string
    active?: boolean

    constructor(name: string, colour: string, _id?:number, active?: boolean){
        if (_id != undefined){
            Category.count = Math.max(_id, Category.count)
        }else{
            Category.count += 1
        }
        this._id = (_id != undefined)? _id: Category.count
        this.name = name
        this.colour = colour
        this.active = (active != undefined)? active: true
    }

    toList(): any[]{
        return [this._id, this.name, this.colour, this.active];
    }

    toCategoryClass(): CategoryClass.Category{
        return {id: this._id, name: this.name, colour: this.colour, active: this.active}
    }

    static count = -1;

    static fromList(properties:any[]):Category{
        return new Category(properties[1], properties[2], properties[0], properties[3]);
    }

    static reset(){
        Category.count = 0
    }
}