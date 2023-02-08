export class Nutrition {
    private carbs: number;
    private energy: number;
    private protein: number;
    private fat: number;
    private saturatedFat: number;
    private fibre: number;
    private salt: number;
    private sugar: number;


    constructor(carbs: number, energy: number, protein: number, fat: number, saturatedFat: number, fibre: number,
                salt: number, sugar: number){
        this.carbs = carbs;
        this.energy = energy;
        this.protein = protein;
        this.fat = fat;
        this.saturatedFat = saturatedFat;
        this.fibre = fibre;
        this.salt = salt;
        this.sugar = sugar;
    }
    //#region Get and Setters
    public get getCarbs() : number {
        return this.carbs;
    }
    public set setCarbs(carbValue : number) {
        this.carbs = carbValue;
    }

    public get getEnergy() : number {
        return this.energy;
    }
    public set setEnergy(energyValue : number) {
        this.energy = energyValue;
    }
    
    public get getProtein() : number {
        return this.protein;
    }
    public set setProtein(proteinValue : number) {
        this.protein = proteinValue;
    }

    public get getFat() : number {
        return this.fat;
    }
    public set setFat(fatValue : number) {
        this.fat = fatValue;
    }

    public get getSaturatedFat() : number {
        return this.saturatedFat;
    }
    public set setSaturatedFat(saturatedFatValue : number) {
        this.saturatedFat = saturatedFatValue;
    }

    public get getFibre() : number {
        return this.fibre;
    }
    public set setFibre(fibreValue : number) {
        this.fibre = fibreValue;
    }

    public get getSalt() : number {
        return this.salt;
    }
    public set setSalt(saltValue : number) {
        this.salt = saltValue;
    }

    public get getSugar() : number {
        return this.sugar;
    }
    public set setSugar(sugarValue : number) {
        this.sugar = sugarValue;
    }
    //#endregion
}

