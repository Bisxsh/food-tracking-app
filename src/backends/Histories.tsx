import * as DB from './Database'

export const DataSize ={
    fullYear: 0,
    firstHalfYear: 1,
    secondHalfYear: 2,
}

export class History{
    _id: number
    userId: number
    date: Date
    mass: number
    cost: number

    constructor(userId: number, date: Date, mass: number, cost:number, _id?: number){
        if (_id != undefined){
            History.count = Math.max(_id, History.count)
        }
        this._id = (_id != undefined)? _id: History.count ++
        this.userId = userId
        this.date = date
        this.mass = mass
        this.cost = cost
    }

    toList(): any[]{
        return [this._id, this.userId, this.date.toISOString().replace("T", " ").replace("Z", ""), this.mass, this.cost];
    }

    static count = 0;

    static fromList(properties:any[]):History{
        return new History(
            properties[1],  // userId
            new Date((properties[2] as string).replace(" ", "T")+"Z"),  // date
            properties[3],  // mass
            properties[4],  // cost
            properties[0]   // _id
        );
    }

    static reset(){
        History.count = 0
    }
}

export async function getMonthlyData(year: number, month: number):Promise<[number, number]>{
    var data: [number, number] = [0,0]
    var sumMass = 0
    var sumCost = 0
    var temp: History[] = await DB.readHistory([year, month])

    for (const history of temp) {
        sumMass += history.mass
        sumCost += history.cost
    }
    data[0] = sumMass
    data[1] = sumCost
    return data
}

export async function getMonthlyDataSet(year: number, dataSize: 0|1|2):Promise<[number[], number[]]>{
    var data: [number[], number[]] = [[],[]]
    var sumMass = 0
    var sumCost = 0
    var temp: History[] = []
    var include = false
    const today = new Date()
    if (year > today.getFullYear()){
        return data
    }

    for (let month = 1; month < 13; month++) {
        if (year == today.getFullYear() && month-1 > today.getMonth()){
            break;
        }
        if (dataSize == DataSize.fullYear){
            temp = await DB.readHistory([year, month])
            include = true
        }else if (dataSize == DataSize.firstHalfYear && month < 7){
            temp = await DB.readHistory([year, month])
            include = true
        }else if (dataSize == DataSize.secondHalfYear && month > 6){
            temp = await DB.readHistory([year, month])
            include = true
        }
        for (const history of temp) {
            sumMass += history.mass
            sumCost += history.cost
        }
        if (include){
            data[0].push(sumMass)
            data[1].push(sumCost)
        }
        sumCost = 0
        sumMass = 0
        temp = []
        include = false
    }

    return data
}


