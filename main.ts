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
    vote: Vote = Vote.HOLD;
    count_per_opinion: number[][] = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0 ,0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0 ,0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0 ,0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0 ,0],
    ]

    constructor(name: string, count: number, values: number[]){
        this.name = name;
        this.count = count;
        this.values = values;

        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 10; j++){
                if(this.values[i] == j - 1 || this.values[i] == j + 3){
                    this.count_per_opinion[i][j] = this.getExtremeCount();
                } else if(this.values[i] == j || this.values[i] == j + 2){
                    this.count_per_opinion[i][j] = this.getLeaningCount();
                } else if(this.values[i] == j + 1){
                    this.count_per_opinion[i][j] = this.getBasisCount();
                } else {
                    this.count_per_opinion[i][j] = 0;
                }
            }
        }
    }

    voteAtRandom(){
        let p = Math.random()
        if(p <= 1/3){
            this.vote = Vote.FOR;
        } else if(p <= 2/3) {
            this.vote = Vote.AGAINST;
        } else {
            this.vote = Vote.HOLD;
        }
    }

    findClosestParty(parties: Party[], axis: Axis, legislation: Legislation, vote: Vote): Party{
        let closestParty: Party | null = null;
        let minDifference: number = Number.MAX_VALUE;
        let party_opinion = this.values[axis.order];

        if(vote == Vote.HOLD){
            return this;
        }

        for(let party in parties){

        }

        if(vote == Vote.FOR){
            if(legislation.values[axis.order] <= 5){
                for(let party of parties){
                    const difference = party_opinion - party.values[axis.order];
                    if(difference < minDifference && difference <= 0 && party.vote != this.vote){
                        minDifference = difference;
                        closestParty = party;
                    }
                }
            } else {
                for(let party of parties){
                    const difference = party_opinion - party.values[axis.order];
                    if(difference < minDifference && difference >= 0 && party.vote != this.vote){
                        minDifference = difference;
                        closestParty = party;
                    }
                }
            }
        } else if(vote == Vote.AGAINST){
            if(legislation.values[axis.order] <= 5){
                for(let party of parties){
                    const difference = party_opinion - party.values[axis.order];
                    if(difference < minDifference && difference >= 0 && party.vote != this.vote){
                        minDifference = difference;
                        closestParty = party;
                    }
                }
            } else {
                for(let party of parties){
                    const difference = party_opinion - party.values[axis.order];
                    if(difference < minDifference && difference <= 0 && party.vote != this.vote){
                        minDifference = difference;
                        closestParty = party;
                    }
                }
            }
        }
        if(closestParty == null){
            return new Party("Niezrzeszeni", 0, [5, 6, 5, 6])
        }
        return closestParty;
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

    calculateMad(legislation: Legislation, axis: Axis): number {
        let mad: number = 0;

        if(this.vote == Vote.HOLD){
            return mad;
        }

        
        if(legislation.values[axis.order] <= 5){

            let tolerance_barrier: number = legislation.values[axis.order] + 1;
            if(this.vote == Vote.FOR){ //LEWICOWA ZA
                for(let i = 9; i > tolerance_barrier - 1; i--){
                    mad += this.count_per_opinion[axis.order][i];
                }
            } else { // LEWICOWA PRZECIW ???
                for(let i = 0; i <= tolerance_barrier; i++){
                    mad += this.count_per_opinion[axis.order][i];
                }
            }
        } else{
            let tolerance_barrier: number = legislation.values[axis.order] - 1;
            if(this.vote == Vote.FOR){ //PRAWICOWA ZA
                for(let i = 0; i < tolerance_barrier; i++){
                    mad += this.count_per_opinion[axis.order][i];
                }
            } else { //PRAWICOWA PRZECIW
                for(let i = 9; i >= tolerance_barrier - 1; i--){
                    mad += this.count_per_opinion[axis.order][i];
                }
            }
        }
        return Math.ceil(mad);
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
    FOR = "FOR",
    AGAINST = "AGAINST",
    HOLD = "HOLD"
}


let numberOfAxes: number = 0;


function calculateChanges(parties: Party[], axes: Axis[], legislation: Legislation){
    for(let party of parties){
        if(party.vote != Vote.HOLD){
            for(let axis of axes){

                let mad: number = party.calculateMad(legislation, axis);
                let furious: number = Math.ceil(mad/5);
                console.log(party.name + " " + axis.name + "Mad: " + mad);
                let closestParty = party.findClosestParty(parties, axis, legislation, party.vote);
                console.log(party.name + " " + axis.name + "ClosestParty: " + closestParty.name)
                party.count -= furious;
                console.log(party.name + " " + axis.name + "Party.count - mad: " + party.count)
                if(closestParty == null){
                    niezrzeszeni += furious;
                } else {
                    closestParty.count += furious;
                    console.log(party.name + " " + axis.name + "ClosestParty.count + mad: " + closestParty.count)
                }
                
            }
        }
    }
    recalculateCountPerOpinion(parties);
}

function recalculateCountPerOpinion(parties: Party[]){
    for(let party of parties){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 10; j++){
                if(party.values[i] == j - 1 || party.values[i] == j + 3){
                    party.count_per_opinion[i][j] = party.getExtremeCount();
                } else if(party.values[i] == j || party.values[i] == j + 2){
                    party.count_per_opinion[i][j] = party.getLeaningCount();
                } else if(party.values[i] == j + 1){
                    party.count_per_opinion[i][j] = party.getBasisCount();
                } else {
                    party.count_per_opinion[i][j] = 0;
                }
            }
        }
    }
}

function getFor(parties: Party[]){
    let count: number = 0;
    for(let party of parties){
        if(party.vote == Vote.FOR) count += party.count;
    }
    return count;
}

function getAgainst(parties: Party[]){
    let count: number = 0;
    for(let party of parties){
        if(party.vote == Vote.AGAINST) count += party.count;
    }
    return count;
}

function getHold(parties: Party[]){
    let count: number = 0;
    for(let party of parties){
        if(party.vote == Vote.HOLD) count += party.count;
    }
    return count;
}

main();
let niezrzeszeni: number = 0;

function main(){

    let parties: Party[] = [];

    let pis = new Party("Prawo i Sprawiedliwość", 115, [4, 3, 7, 7]);
    parties.push(pis);
    let ko = new Party("Koalicja Obywatelska", 115, [6, 5, 4, 4]);
    parties.push(ko);
    let lewica = new Party("Nowa Lewica", 115, [8,3,3,3]);
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


    let legislation = new Legislation("Ustawa", economic_policy, [7]);

    pis.voteAtRandom();
    ko.voteAtRandom();
    lewica.voteAtRandom();
    ko.voteAtRandom();

    console.log(parties);
    console.log("Niezrzeszeni: " + niezrzeszeni)
    calculateChanges(parties, axes, legislation);
    console.log(parties);
    console.log("Niezrzeszeni: " + niezrzeszeni)

}