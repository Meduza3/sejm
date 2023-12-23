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
    order: number;
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
        this.order = party_count - 1;

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


function log(message: string) {
    const logInput = document.getElementById("log") as HTMLTextAreaElement;
    if (logInput) {
        logInput.value += message + "\n"; // Use '\n' for a new line in textarea
        logInput.scrollTop = logInput.scrollHeight; // Scroll to the bottom
    }
}



function calculateChanges(parties: Party[], axes: Axis[], legislation: Legislation){
    for(let party of parties){
        if(party.vote != Vote.HOLD){
            for(let axis of axes){

                let mad: number = party.calculateMad(legislation, axis);
                let furious: number = Math.ceil(mad/5);
                log(party.name + " " + axis.name + " Furious: " + furious);
                let closestParty = party.findClosestParty(parties, axis, legislation, party.vote);
                log(party.name + " " + axis.name + " ClosestParty: " + closestParty.name)
                party.count -= furious;
                log(party.name + " " + axis.name + " Party.count - furious: " + party.count)
                if(closestParty == null){
                    niezrzeszeni += furious;
                } else {
                    closestParty.count += furious;
                    log(party.name + " " + axis.name + " ClosestParty.count + furious: " + closestParty.count)
                }
                
            }
        }
        const count_display = document.getElementById(`pcd_${party.order}`) as HTMLInputElement;
        count_display.value = party.count.toString();
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

let niezrzeszeni: number = 0;

document.getElementById('add_p').addEventListener('click', function() {
    const party_name = document.getElementById('party_name_input') as HTMLInputElement;
   createPartyElement(party_name.value);
   party_count++;
});

document.getElementById('play_button').addEventListener('click', function() {
    console.log("playing!")
    console.log(party_count);
    let parties: Party[] = [];
    for(let i = 0; i < party_count; i++){
        const name = document.getElementById(`pn_${i}`);
        const count = document.getElementById(`pcd_${i}`) as HTMLInputElement;

        const v1 = document.getElementById(`pvi_${i}_A`) as HTMLInputElement;
        const v2 = document.getElementById(`pvi_${i}_B`) as HTMLInputElement;
        const v3 = document.getElementById(`pvi_${i}_C`) as HTMLInputElement;
        const v4 = document.getElementById(`pvi_${i}_D`) as HTMLInputElement;

        let party = new Party(name.innerHTML, +count.value, [+v1.value, +v2.value, +v3.value, +v4.value])
        parties.push(party);
    }
    console.log(parties)
    for(let party of parties){
        party.voteAtRandom();
    }
    console.log(parties)



    const l_name = document.getElementById("ustawa_name_input") as HTMLInputElement;
    const l_v1 = document.getElementById("ustawa_input_0") as HTMLInputElement;
    const l_v2 = document.getElementById("ustawa_input_1") as HTMLInputElement;
    const l_v3 = document.getElementById("ustawa_input_2") as HTMLInputElement;
    const l_v4 = document.getElementById("ustawa_input_3") as HTMLInputElement;

    let axes: Axis[] = [new Axis("A"), new Axis("B"), new Axis("C"), new Axis("D"), ]

    let legislation = new Legislation(l_name.value, axes[0], [+l_v1.value, +l_v2.value, +l_v3.value, +l_v4.value]);
    console.log(legislation);
    calculateChanges(parties, axes, legislation);
    console.log("finished calculating changes");
    console.log(parties);
})

let party_count: number = 0;

function createPartyElement(name) {
    const div = document.createElement('div');
    div.className = 'partia';
    div.innerHTML = `
    <div class="party_header">
    <div style="padding="5px;" id="pn_${party_count}" >${name}</div>
    <input class="party_count_display" id="pcd_${party_count}" type="number" min="0" value="150" max="460"/> 
    <input type="checkbox" id="for_${party_count}" class="for-checkbox">
    <input type="checkbox" id="against_${party_count}" class="against-checkbox">
    <input type="checkbox" id="hold_${party_count}" class="hold-checkbox">
    </div>


    <div class="party_values">
    <input class="party_value_input" id="pvi_${party_count}_A" type="number" min="1" value="3" max="10"/>
    <input class="party_value_input" id="pvi_${party_count}_B" type="number" min="1" value="3" max="10"/>
    <input class="party_value_input" id="pvi_${party_count}_C" type="number" min="1" value="3" max="10"/>
    <input class="party_value_input" id="pvi_${party_count}_D" type="number" min="1" value="3" max="10"/>
    </div>
  `;

  const targetColumn = document.getElementById("party_column");
  targetColumn.appendChild(div);
}