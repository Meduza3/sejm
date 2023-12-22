let message: string = 'Hello World'!;

console.log(message);

class Axis {
    name: string;
    order: number;

    constructor(name: string){
        this.name = name;
        this.order = numberOfAxes;
        numberOfAxes++;
    }
}

class Party {
    name: string;
    count: number;
    values: number[];

    constructor(name: string, count: number, values: number[]){
        this.name = name;
        this.count = count;
        this.values = values;
    }
}

class Legislation {
    name: string;
    main_axis: Axis;
    values: number[];

    constructor(name: string, main_axis: Axis, values: number[]){
        this.name = name;
        this.main_axis = main_axis;
        this.values = values;
    }
}


let numberOfAxes: number = 0;


main();
function main(){

    let parties: Party[] = [];

    let pis = new Party("Prawo i Sprawiedliwość", 153, [4, 3, 7, 7]);
    parties.push(pis);
    let ko = new Party("Koalicja Obywatelska", 153, [6, 5, 4, 4]);
    parties.push(ko);
    let lewica = new Party("Nowa Lewica", 153, [3,3,3,3]);
    parties.push(lewica);


    let axes: Axis[] = [] 
    
    let economic_policy = new Axis("Polityka Ekonomiczna");
    axes.push(economic_policy);
    let fiscal_policy = new Axis("Polityka Fiskalna");
    axes.push(fiscal_policy);
    let culture = new Axis("Kultura");
    axes.push(culture);
    let eu = new Axis("Stosunek do UE");
    axes.push(eu);

    console.log(parties, axes);


}