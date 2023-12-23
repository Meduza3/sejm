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
            //return new Party("Niezrzeszeni", 0, [5, 6, 5, 6], "#fffff")
            //Don't lose posłowie!
            return this;
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

            let tolerance_barrier: number = legislation.values[axis.order];

            if(this.vote == Vote.FOR){ //LEWICOWA ZA
                for(let i = 9; i > tolerance_barrier - 1; i--){
                    mad += this.count_per_opinion[axis.order][i];
                }
            } else { // LEWICOWA PRZECIW ???
                for(let i = 0; i <= tolerance_barrier - 1; i++){
                    mad += this.count_per_opinion[axis.order][i];
                }
            }
        } else{
            let tolerance_barrier: number = legislation.values[axis.order] - 2;
            if(this.vote == Vote.FOR){ //PRAWICOWA ZA
                for(let i = 0; i < tolerance_barrier - 1; i++){
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
                if(legislation.values[axis.order] == 0){
                    continue;
                }
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

        console.log(party.name + " count: " + party.count)
    }
    recalculateCountPerOpinion(parties);
}

function updateCountDisplay(parties: Party[]){
    for(let i = 0; i < party_count; i++){
        let count_display = document.getElementById(`pcd_${i}`) as HTMLInputElement;
        console.log("Count display value before change: " + count_display.value);
        console.log("parties[i] name: " + parties[i].name + " parties[i] count: " + parties[i].count)
        count_display.value = parties[i].count.toString();
        console.log("Count display value after change: " + count_display.value);
    }
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


function generatePartyList(): Party[]{
    let parties: Party[] = [];
    for(let i = 0; i < party_count; i++){
        const name = document.getElementById(`pn_${i}`);
        const count = document.getElementById(`pcd_${i}`) as HTMLInputElement;

        const v1 = document.getElementById(`pvi_${i}_A`) as HTMLInputElement;
        const v2 = document.getElementById(`pvi_${i}_B`) as HTMLInputElement;
        const v3 = document.getElementById(`pvi_${i}_C`) as HTMLInputElement;
        const v4 = document.getElementById(`pvi_${i}_D`) as HTMLInputElement;

        const color = document.getElementById(`party_color_${i}`) as HTMLInputElement;

        let party = new Party(name.innerHTML, +count.value, [+v1.value, +v2.value, +v3.value, +v4.value], color.value)
        parties.push(party);
    }
    party_count = parties.length;
    return parties;
}

function setVotes(parties: Party[]){
    for(let i = 0; i < party_count; i++){
        let party = parties[i]
        var checkboxes = document.getElementsByName(`v_${i}`)
        var selectedValue;
        for (let i = 0; i < checkboxes.length; i++) {
            let checkbox = checkboxes[i] as HTMLInputElement;
            if (checkbox.checked) {
                selectedValue = checkbox.value;
                break;
            }
        }

        if(selectedValue == "FOR"){
            party.setVote(Vote.FOR);
        } else if(selectedValue == "AGAINST"){
            party.setVote(Vote.AGAINST);
        } else if(selectedValue == "HOLD"){
            party.setVote(Vote.HOLD);
        }
    }
}

function setLegislation(axes: Axis[]): Legislation {
    const l_name = document.getElementById("ustawa_name_input") as HTMLInputElement;
    const l_v1 = document.getElementById("ustawa_input_0") as HTMLInputElement;
    const l_v2 = document.getElementById("ustawa_input_1") as HTMLInputElement;
    const l_v3 = document.getElementById("ustawa_input_2") as HTMLInputElement;
    const l_v4 = document.getElementById("ustawa_input_3") as HTMLInputElement;

    
    return new Legislation(l_name.value, axes[0], [+l_v1.value, +l_v2.value, +l_v3.value, +l_v4.value]);
}

document.getElementById('play_button').addEventListener('click', function() {
    
    initialize();

    console.log("playing!")
    console.log("Number of parties: " + party_count);

    console.log("Number of parties: " + party_count);

    let legislation = setLegislation(axes);

    console.log(legislation);

    calculateChanges(parties, axes, legislation);
    updateCountDisplay(parties);
    console.log("finished calculating changes");
})



function createPartyElement(name) {
    const div = document.createElement('div');
    div.className = 'partia';
    div.innerHTML = `
    <div class="party_header">
    <div style="padding="5px;" id="pn_${party_count}" >${name}</div>
    <input class="party_count_display" id="pcd_${party_count}" type="number" min="0" value="150" max="460"/> 

    <input type="radio" name="v_${party_count}" checked value="FOR" id="for_${party_count}" class="for-checkbox">
    <input type="radio" name="v_${party_count}" value="AGAINST" id="against_${party_count}" class="against-checkbox">
    <input type="radio" name="v_${party_count}" value="HOLD" id="hold_${party_count}" class="hold-checkbox">

    <input type="color" id="party_color_${party_count}"/>
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


let parties: Party[];
let party_count: number = 0;
let axes: Axis[] = [new Axis("A"), new Axis("B"), new Axis("C"), new Axis("D"), ]

document.getElementById('initialize_button').addEventListener('click', function() {
    initialize();
})

function initialize(){
    console.log("Initializing");
    parties = generatePartyList();
    setVotes(parties);
    console.log(parties);
    drawOnAxes();
}


const axis_element = document.getElementById('test_axis_element');
const axis_width = axis_element ? axis_element.offsetWidth: 0;
const axis_height = axis_element ? axis_element.offsetHeight : 0;

function drawOnAxes(){
    const playerElements = document.querySelectorAll('.player');
    playerElements.forEach(el => el.remove());

    for(let party of parties){
        
        for(let i = 0; i <= 3; i++){
            const axis = document.getElementById(`axis_${i}`);
            const marker_base = document.createElement('div');
            const marker_leaning_left = document.createElement('div');
            const marker_leaning_right = document.createElement('div');
            const marker_extreme_left = document.createElement('div');
            const marker_extreme_right = document.createElement('div');

            marker_base.className = "player";
            marker_leaning_left.className = "player";
            marker_leaning_right.className = "player";
            marker_extreme_left.className = "player";
            marker_extreme_right.className = "player";
            const base_position = party.values[i];
            const ll_position = base_position - 1;
            const el_position = base_position - 2;
            const lr_position = base_position + 1
            const er_position = base_position + 2;
            
            marker_base.style.left = ((base_position) - 1)* axis_width + 'px'
            marker_base.style.width = axis_width + 'px';
            marker_base.style.height = 50 + 'px';
            marker_base.style.backgroundColor = party.color;

            marker_leaning_left.style.left = ((ll_position) -1) * axis_width + 'px'
            marker_leaning_left.style.width = axis_width + 'px';
            marker_leaning_left.style.height = 20 + 'px';
            marker_leaning_left.style.backgroundColor = party.color;

            marker_leaning_right.style.left = ((lr_position) - 1)* axis_width + 'px'
            marker_leaning_right.style.width = axis_width + 'px';
            marker_leaning_right.style.height = 20 + 'px';
            marker_leaning_right.style.backgroundColor = party.color;

            marker_extreme_left.style.left = ((el_position) -1)* axis_width + 'px'
            marker_extreme_left.style.width = axis_width + 'px';
            marker_extreme_left.style.height = 5 + 'px';
            marker_extreme_left.style.backgroundColor = party.color;

            marker_extreme_right.style.left = ((er_position) -1)* axis_width + 'px'
            marker_extreme_right.style.width = axis_width + 'px';
            marker_extreme_right.style.height = 5 + 'px';
            marker_extreme_right.style.backgroundColor = party.color;


            axis.appendChild(marker_base);
            axis.appendChild(marker_leaning_left);
            axis.appendChild(marker_leaning_right);
            axis.appendChild(marker_extreme_left);
            axis.appendChild(marker_extreme_right);
        }
    }
}

let ui0 = document.getElementById("ustawa_input_0") as HTMLInputElement
ui0.addEventListener('input', () => {
    let uid0 = document.getElementById("ustawa_input_display_0") as HTMLInputElement
    uid0.value = ui0.value
})

let ui1 = document.getElementById("ustawa_input_1") as HTMLInputElement
ui1.addEventListener('input', () => {
    let uid1 = document.getElementById("ustawa_input_display_1") as HTMLInputElement
    uid1.value = ui1.value
})

let ui2 = document.getElementById("ustawa_input_2") as HTMLInputElement
ui2.addEventListener('input', () => {
    let uid2 = document.getElementById("ustawa_input_display_2") as HTMLInputElement
    uid2.value = ui2.value
})

let ui3 = document.getElementById("ustawa_input_3") as HTMLInputElement
ui3.addEventListener('input', () => {
    let uid3 = document.getElementById("ustawa_input_display_3") as HTMLInputElement
    uid3.value = ui3.value
})