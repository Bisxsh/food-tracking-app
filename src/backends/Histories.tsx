

export class History{
    _id: Number
    userId: Number
    date: Date
    mass: Number
    cost: Number

    constructor(userId: Number, date: Date, mass: Number, cost:Number, _id?: Number){
        this._id = (_id != undefined)? _id: History.count ++
        this.userId = userId
        this.date = date
        this.mass = mass
        this.cost = cost
    }

    static count = 0
}