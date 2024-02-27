export class Party {
    name: string;
    count: number;
    values: number[];
    vote: Vote = Vote.HOLD;
    order: number;
    count_per_opinion: number[][] = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0 ,0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0 ,0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0 ,0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0 ,0],
    ]
    color: string;


    constructor(name: string, count: number, values: number[], color: string){
        this.name = name;
        this.count = count;
        this.values = values;
        this.order = party_count - 1;
        this.color = color;

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
        console.log("Szukamy najbliższej partii dla: " + this.name + " zagłosowano " + this.vote )
        let closestParty: Party | null = null;
        let minDifference: number = Number.MAX_VALUE;
        let party_opinion = this.values[axis.order];

        if(vote == Vote.HOLD){
            return this;
            console.log("HOLD, pomijamy")
        }

        for(let party of parties){
            if(legislation.values[axis.order] <= 5){ //LEWACKA USTAWA
                if(this.vote == Vote.FOR){ //LEWACKA i głosowano ZA
                    //Znajdź najbliższą partię na prawo
                    console.log("rozstrzygam bliskość do " + party.name)
                    console.log("party.values[axis.order] - party_opinion = " + (party.values[axis.order] - party_opinion))
                    if(party.values[axis.order] - party_opinion < minDifference && party.values[axis.order] - party_opinion >= 0 && party.vote != this.vote){
                        minDifference = party.values[axis.order] - party_opinion;
                        console.log("minDifference = " + (party.values[axis.order] - party_opinion))
                        closestParty = party;
                        console.log("closestParty = "+party.name)
                    }
                } else { //LEWACKA i głosowano PRZECIW
                    //Znajdź najbliższą partię na lewo
                    console.log("rozstrzygam bliskość do " + party.name)
                    console.log("party_opinion - party.values[axis.order] = " + (party_opinion - party.values[axis.order]))
                    if(party_opinion - party.values[axis.order] < minDifference && party_opinion - party.values[axis.order] >= 0 && party.vote != this.vote){
                        minDifference = party_opinion - party.values[axis.order];
                        console.log("minDifference = " + (party_opinion - party.values[axis.order]))
                        closestParty = party;
                        console.log("closestParty = "+party.name)
                    }
                }
            } else { //PRAWACKA USTAWA
                if(this.vote == Vote.FOR){ //PRAWACKA i głosowano ZA
                    // Znajdź najbliższą partię na lewo
                    console.log("rozstrzygam bliskość do " + party.name)
                    console.log("party_opinion - party.values[axis.order] = " + (party_opinion - party.values[axis.order]))
                    if(party_opinion - party.values[axis.order] < minDifference && party_opinion - party.values[axis.order] >= 0 && party.vote != this.vote){
                        minDifference = party_opinion - party.values[axis.order];
                        console.log("minDifference = " + (party_opinion - party.values[axis.order]))
                        closestParty = party;
                        console.log("closestParty = "+party.name)
                    }
                } else {
                    console.log("rozstrzygam bliskość do " + party.name)
                    console.log("party.values[axis.order] - party_opinion = " + (party.values[axis.order] - party_opinion))
                    if(party.values[axis.order] - party_opinion < minDifference && party.values[axis.order] - party_opinion >= 0 && party.vote != this.vote){
                        minDifference = party.values[axis.order] - party_opinion;
                        console.log("minDifference = " + (party.values[axis.order] - party_opinion))
                        closestParty = party;
                        console.log("closestParty = "+party.name)
                    }
                }
            }
        }

        if(closestParty == null){
            return new Party("Niezrzeszeni", 0, [0,0,0,0], "grey");
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
        let legislation_value = legislation.values[axis.order];
        console.log("LEGISLATION VALUE: " + legislation_value)

        if(this.vote == Vote.HOLD){
            return mad;
        }

        if(this.vote == Vote.AGAINST){
            console.log(this.name + " VOTED AGAINST " + legislation.name)
            if(legislation_value <= 5){
                console.log(legislation.name + " IS LEWACKA") //WORKING

                for(let i = 0; i <= legislation_value; i++){
                    console.log(this.name + " count per opinion " + i + ": " + this.count_per_opinion[axis.order][i])
                    mad += this.count_per_opinion[axis.order][i];
                }

            } else {
                console.log(legislation.name + " IS NOT LEWACKA") //NOT WORKING
                for(let i = 10; i > legislation_value - 2; i--){
                    console.log(this.name + " count per opinion " + (i - 1) + ": " + this.count_per_opinion[axis.order][i - 1])
                    mad += this.count_per_opinion[axis.order][i - 1];
                }
                console.log("MAD: " + mad)
            }
        } else if(this.vote == Vote.FOR){
            console.log(this.name + " VOTED FOR " + legislation.name)
            if(legislation_value <= 5){
                console.log(legislation.name + " IS LEWACKA")
                //Wkurzą się wszyscy ci, którzy tej ustawy nie popierali: na prawo od
                for(let i = 10; i > legislation_value + 1; i--){
                    console.log(this.name + " count per opinion " + (i - 1) + ": " + this.count_per_opinion[axis.order][i - 1])
                    mad += this.count_per_opinion[axis.order][i - 1];
                }


            } else {
                console.log(legislation.name + " IS NOT LEWACKA")

                for(let i = 0; i < legislation_value - 2; i++){
                    console.log(this.name + " count per opinion " + i + ": " + this.count_per_opinion[axis.order][i])
                    mad += this.count_per_opinion[axis.order][i];
                }
            }
        }

        return Math.ceil(mad);
    }
}