import { Party } from "./party";
import { Axis } from "./axis";
import { Legislation } from "./legislation";
import { Vote } from "./vote";


let numberOfAxes: number = 0;

initialize();

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
                if(furious > 0){
                    //console.log(party.name + " " + axis.name + " Furious: " + furious);
                    let closestParty = party.findClosestParty(parties, axis, legislation, party.vote);
                    //console.log(party.name + " " + axis.name + " ClosestParty: " + closestParty.name)
                    party.count -= furious;
                    //console.log(party.name + " " + axis.name + " Party.count - furious: " + party.count)
                    if(closestParty == null){
                        niezrzeszeni += furious;
                    } else {
                        closestParty.count += furious;
                        //console.log(party.name + " " + axis.name + " ClosestParty.count + furious: " + closestParty.count)
                    }
                log(party.name + " on axis " + axis.name + ": " + furious + " going to " + closestParty.name );
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
        count_display.value = parties[i].count.toString();
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

function countNiezrzeszeni(parties: Party[]) {
    niezrzeszeni = 460;
    for(let party of parties){
        niezrzeszeni -= party.count;
    }
}

document.getElementById('add_p').addEventListener('click', function() {
    const party_name = document.getElementById('party_name_input') as HTMLInputElement;
   createPartyElement(party_name.value);
   party_count++;
   initialize()
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
    let u_input = document.getElementById("ustawa_name_input") as HTMLInputElement
    log("");
    log("Ustawa: " + u_input.value);

    let legislation = setLegislation(axes);

    console.log(legislation);

    displayOutcome(parties);
    calculateChanges(parties, axes, legislation);
    countNiezrzeszeni(parties);
    updateCountDisplay(parties);
    colorCircles();
    console.log("finished calculating changes");
})

function displayOutcome(parties: Party[]){
    let for_count = 0;
    let against_count = 0;
    let hold_count = 0;
    if(Math.random() >= 0.5){
        log("Niezrzeszeni zagłosowali: ZA")
        for_count += niezrzeszeni;
    } else {
        log("Niezrzeszeni zagłosowali: PRZECIW")
        against_count += niezrzeszeni;
    }
    for(let party of parties){
        if(party.vote == Vote.FOR){
            for_count += party.count;
        } else if (party.vote == Vote.AGAINST){
            against_count += party.count;
        } else if (party.vote == Vote.HOLD){
            hold_count += party.count;
        }
    }
    log("ZA: " + for_count);
    log("PRZECIW: " + against_count);
    log("WSTRZYMAŁO SIĘ: " + hold_count);
    if(for_count > against_count){
        log("Ustawa przyjęta");
    } else {
        log("Ustawa odrzucona");
    }
}



function createPartyElement(name) {
    const div = document.createElement('div');
    div.className = 'partia';

    div.innerHTML = `
    <div class="party_header">
    <div style="padding="5px;" id="pn_${party_count}" >${name}</div>
    <input class="party_count_display" id="pcd_${party_count}" type="number" min="0" value="100" max="460"/> 

    <input type="radio" name="v_${party_count}" checked value="FOR" id="for_${party_count}" class="for-checkbox">
    <input type="radio" name="v_${party_count}" value="AGAINST" id="against_${party_count}" class="against-checkbox">
    <input type="radio" name="v_${party_count}" value="HOLD" id="hold_${party_count}" class="hold-checkbox">

    <input type="color" class="party_color_input" value="#4C4CFF" id="party_color_${party_count}"/>
    </div>


    <div class="party_values">
    <input class="party_value_input" id="pvi_${party_count}_A" type="number" min="3" value="3" max="8"/>
    <input class="party_value_input" id="pvi_${party_count}_B" type="number" min="3" value="3" max="8"/>
    <input class="party_value_input" id="pvi_${party_count}_C" type="number" min="3" value="3" max="8"/>
    <input class="party_value_input" id="pvi_${party_count}_D" type="number" min="3" value="3" max="8"/>
    </div>
  `;
  
  const targetColumn = document.getElementById("party_column");
  targetColumn.appendChild(div);
}


let parties: Party[];
let party_count: number = 0;
let axes: Axis[] = [new Axis("A", 1), new Axis("B", 2), new Axis("C", 3), new Axis("D", 4), ]



let party_value_inputs = document.querySelectorAll('.party_value_input');
let party_count_inputs = document.querySelectorAll('.party_count_display');
let party_color_inputs = document.querySelectorAll('.party_color_input');

function initialize(){
    console.log("Initializing");
    parties = generatePartyList();
    setVotes(parties);
    console.log(parties);
    drawOnAxes();
    colorCircles();
    recalculateCountPerOpinion(parties);
    countNiezrzeszeni(parties);
    
    


    party_value_inputs = document.querySelectorAll('.party_value_input')
    party_value_inputs.forEach(input => {
        input.addEventListener('change', initialize)
    })

    party_count_inputs = document.querySelectorAll('.party_count_display')
    party_count_inputs.forEach(input => {
        input.addEventListener('change', initialize)
    })

    party_color_inputs = document.querySelectorAll('.party_color_input')
    party_color_inputs.forEach(input => {
        input.addEventListener('change', initialize)
    })


}


const axis_element = document.getElementById('axis_element_2_9');
const axis_width = axis_element ? axis_element.offsetWidth: 0;
const axis_height = axis_element ? axis_element.offsetHeight : 0;

function drawOnAxes() {
    const playerElements = document.querySelectorAll('.player');
    playerElements.forEach(el => el.remove());

    let offset:number = 0;
    for (let party of parties) {
        for (let i = 0; i <= 3; i++) {
            const axis = document.getElementById(`axis_${i}`);
            const base_position = party.values[i];

            createAndAppendMarker(axis, base_position, 50 + offset, party.color); // Base
            createAndAppendMarker(axis, base_position - 1, 20 + offset, party.color); // Leaning left
            createAndAppendMarker(axis, base_position + 1, 20 + offset, party.color); // Leaning right
            createAndAppendMarker(axis, base_position - 2, 5 + offset, party.color); // Extreme left
            createAndAppendMarker(axis, base_position + 2, 5 + offset, party.color); // Extreme right
            offset++;
        }
    }
}

function createAndAppendMarker(axis, position, height, color) {
    const marker = document.createElement('div');
    marker.className = "player";
    marker.style.left = (position - 1) * axis_width + 'px';
    marker.style.width = axis_width + 'px';
    marker.style.height = height + 'px';
    marker.style.backgroundColor = color;
    axis.appendChild(marker);
}


for (let i = 0; i < 4; i++) {
    let ui = document.getElementById(`ustawa_input_${i}`) as HTMLInputElement;
    ui.addEventListener('input', () => {
        let uid = document.getElementById(`ustawa_input_display_${i}`) as HTMLInputElement;
        if(parseInt(ui.value) <= 5) {
            ui.style.accentColor = "green";
        } else {
            ui.style.accentColor = "red";
        }
        uid.value = ui.value;

            colorAxisElements(ui.value,i)

    });
}

function colorAxisElements(axis_value, axisIndex) {
    for (let elementIndex = 1; elementIndex <= 10; elementIndex++) {
        const element = document.getElementById(`axis_element_${axisIndex}_${elementIndex}`);

        if (element) {
            
            const elementValue = parseInt(element.textContent);
            if(axis_value == 0){
                element.style.backgroundColor = "white";
                continue;
            }
            if (axis_value == 1) element.style.backgroundColor = (elementValue < 3) ? "gold" : "white";
            if (axis_value == 2) element.style.backgroundColor = (elementValue < 4) ? "gold" : "white";
            if (axis_value == 3) element.style.backgroundColor = (elementValue < 5) ? "gold" : "white";
            if (axis_value == 4) element.style.backgroundColor = (elementValue < 6) ? "gold" : "white";
            if (axis_value == 5) element.style.backgroundColor = (elementValue < 7) ? "gold" : "white";

            if (axis_value == 6) element.style.backgroundColor = (elementValue > 4) ? "gold" : "white";
            if (axis_value == 7) element.style.backgroundColor = (elementValue > 5) ? "gold" : "white";
            if (axis_value == 8) element.style.backgroundColor = (elementValue > 6) ? "gold" : "white";
            if (axis_value == 9) element.style.backgroundColor = (elementValue > 7) ? "gold" : "white";
            if (axis_value == 10) element.style.backgroundColor = (elementValue > 8) ? "gold" : "white";
        }
    }
}





function createCircle(i: number): HTMLElement {
    const circle = document.createElement('div');
    circle.className = 'circle';
    circle.id = `circle_${i}`;
    return circle;
}

function fillContainerWithCircles(containerId: string, totalCircles: number, circlesPerColumn: number): void {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found');
        return;
    }

    for (let i = 0; i < totalCircles; i++) {
        container.appendChild(createCircle(i));
    }

    const columns = Math.ceil(totalCircles / circlesPerColumn);
    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

fillContainerWithCircles('koryto', 460, 46);

function colorCircles() {
    let coloredCirclesCount = 0;
    for (let party of parties) {
        for (let i = 0; i < party.count; i++) {
            const circle = document.getElementById(`circle_${coloredCirclesCount}`);
            if (circle) {
                circle.style.backgroundColor = party.color;
                coloredCirclesCount++;
            }
        }
    }
    for (let i = 490; i >= coloredCirclesCount; i--) {
        const circle = document.getElementById(`circle_${i}`);
        if (circle) {
            circle.style.backgroundColor = "gray";
        }
    }
}
