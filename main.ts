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
    vote: Vote = Vote.Hold;

    constructor(name: string, count: number, values: number[]){
        this.name = name;
        this.count = count;
        this.values = values;
    }

    getExtremeCount() {
        return this.count * 0.05;
    }

    getLeaningCount() {
        return this.count * 0.2;
    }

    getBasisCount() {
        return this.count * 0.5;
    }

    setVote(vote: Vote){
        this.vote = vote;
    }

    calculateAngryCount(value: number){

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

enum Vote {
    For,
    Against,
    Hold
}


let numberOfAxes: number = 0;

function calculateChanges(parties: Party[], legislation: Legislation){
    for(let party of parties){
       // party.calculateAngryCount();
    }

}

main();
function main(){

    let parties: Party[] = [];
    let niezrzeszeni: number = 0;

    let pis = new Party("Prawo i Sprawiedliwość", 115, [4, 3, 7, 7]);
    parties.push(pis);
    let ko = new Party("Koalicja Obywatelska", 115, [6, 5, 4, 4]);
    parties.push(ko);
    let lewica = new Party("Nowa Lewica", 115, [3,3,3,3]);
    parties.push(lewica);
    let konfa = new Party("Konfederacja", 115, [8, 7, 8, 8])
    parties.push(konfa);


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

    let invitro = new Legislation("Finansowanie in Vitro", fiscal_policy, [-1, 4, 4, -1]);

    pis.setVote(Vote.Against);
    konfa.setVote(Vote.Hold);
    lewica.setVote(Vote.For);
    ko.setVote(Vote.For);

    calculateChanges(parties, invitro);
    

}