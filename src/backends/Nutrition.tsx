import * as NutritionClass from "../classes/NutritionClass";

export class Nutrition {
  _id!: number;
  carbs: number;
  carbsUnit: string;
  energy: number;
  energyUnit: string;
  protein: number;
  proteinUnit: string;
  fat: number;
  fatUnit: string;
  saturatedFat: number;
  saturatedFatUnit: string;
  fibre: number;
  fibreUnit: string;
  salt: number;
  saltUnit: string;
  sugar: number;
  sugarUnit: string;

  constructor(
    _id?: number,
    carbs?: number,
    carbsUnit?: string,
    energy?: number,
    energyUnit?: string,
    protein?: number,
    proteinUnit?: string,
    fat?: number,
    fatUnit?: string,
    saturatedFat?: number,
    saturatedFatUnit?: string,
    fibre?: number,
    fibreUnit?: string,
    salt?: number,
    saltUnit?: string,
    sugar?: number,
    sugarUnit?: string
  ) {
    if (_id != undefined && _id != -1) {
      Nutrition.count = Math.max(_id, Nutrition.count);
    } else if (_id == undefined || _id == -1) {
      Nutrition.count += 1;
    }
    this._id = _id != undefined && _id != -1 ? _id : Nutrition.count;
    this.carbs = carbs != undefined ? carbs : 0;
    this.carbsUnit = carbsUnit != undefined ? carbsUnit : "g";
    this.energy = energy != undefined ? energy : 0;
    this.energyUnit = energyUnit != undefined ? energyUnit : "kJ";
    this.protein = protein != undefined ? protein : 0;
    this.proteinUnit = proteinUnit != undefined ? proteinUnit : "g";
    this.fat = fat != undefined ? fat : 0;
    this.fatUnit = fatUnit != undefined ? fatUnit : "g";
    this.saturatedFat = saturatedFat != undefined ? saturatedFat : 0;
    this.saturatedFatUnit =
      saturatedFatUnit != undefined ? saturatedFatUnit : "g";
    this.fibre = fibre != undefined ? fibre : 0;
    this.fibreUnit = fibreUnit != undefined ? fibreUnit : "g";
    this.salt = salt != undefined ? salt : 0;
    this.saltUnit = saltUnit != undefined ? saltUnit : "g";
    this.sugar = sugar != undefined ? sugar : 0;
    this.sugarUnit = sugarUnit != undefined ? sugarUnit : "g";
  }

  toList(): any[] {
    return [
      this._id,
      this.carbs,
      this.carbsUnit,
      this.energy,
      this.energyUnit,
      this.protein,
      this.proteinUnit,
      this.fat,
      this.fatUnit,
      this.saturatedFat,
      this.saturatedFatUnit,
      this.fibre,
      this.fibreUnit,
      this.salt,
      this.saltUnit,
      this.sugar,
      this.sugarUnit,
    ];
  }

  toNutritionClass(): NutritionClass.Nutrition {
    return new NutritionClass.Nutrition(
      this.carbs,
      this.energy,
      this.protein,
      this.fat,
      this.saturatedFat,
      this.fibre,
      this.salt,
      this.sugar
    );
  }

  static count = -1;

  static fromList(properties: any[]): Nutrition {
    return new Nutrition(
      properties[0],
      properties[1],
      properties[2],
      properties[3],
      properties[4],
      properties[5],
      properties[6],
      properties[7],
      properties[8],
      properties[9],
      properties[10],
      properties[11],
      properties[12],
      properties[13],
      properties[14],
      properties[15],
      properties[16]
    );
  }

  static reset() {
    Nutrition.count = 0;
  }
}
