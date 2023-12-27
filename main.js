var Axis = /** @class */ (function () {
    function Axis(name) {
        this.name = name;
        this.order = numberOfAxes;
        numberOfAxes++;
    }
    return Axis;
}());
var Party = /** @class */ (function () {
    function Party(name, count, values, color) {
        this.vote = Vote.HOLD;
        this.count_per_opinion = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        this.name = name;
        this.count = count;
        this.values = values;
        this.order = party_count - 1;
        this.color = color;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 10; j++) {
                if (this.values[i] == j - 1 || this.values[i] == j + 3) {
                    this.count_per_opinion[i][j] = this.getExtremeCount();
                }
                else if (this.values[i] == j || this.values[i] == j + 2) {
                    this.count_per_opinion[i][j] = this.getLeaningCount();
                }
                else if (this.values[i] == j + 1) {
                    this.count_per_opinion[i][j] = this.getBasisCount();
                }
                else {
                    this.count_per_opinion[i][j] = 0;
                }
            }
        }
    }
    Party.prototype.voteAtRandom = function () {
        var p = Math.random();
        if (p <= 1 / 3) {
            this.vote = Vote.FOR;
        }
        else if (p <= 2 / 3) {
            this.vote = Vote.AGAINST;
        }
        else {
            this.vote = Vote.HOLD;
        }
    };
    Party.prototype.findClosestParty = function (parties, axis, legislation, vote) {
        console.log("Szukamy najbliższej partii dla: " + this.name + " zagłosowano " + this.vote);
        var closestParty = null;
        var minDifference = Number.MAX_VALUE;
        var party_opinion = this.values[axis.order];
        if (vote == Vote.HOLD) {
            return this;
            console.log("HOLD, pomijamy");
        }
        for (var _i = 0, parties_1 = parties; _i < parties_1.length; _i++) {
            var party = parties_1[_i];
            if (legislation.values[axis.order] <= 5) { //LEWACKA USTAWA
                if (this.vote == Vote.FOR) { //LEWACKA i głosowano ZA
                    //Znajdź najbliższą partię na prawo
                    console.log("rozstrzygam bliskość do " + party.name);
                    console.log("party.values[axis.order] - party_opinion = " + (party.values[axis.order] - party_opinion));
                    if (party.values[axis.order] - party_opinion < minDifference && party.values[axis.order] - party_opinion >= 0 && party.vote != this.vote) {
                        minDifference = party.values[axis.order] - party_opinion;
                        console.log("minDifference = " + (party.values[axis.order] - party_opinion));
                        closestParty = party;
                        console.log("closestParty = " + party.name);
                    }
                }
                else { //LEWACKA i głosowano PRZECIW
                    //Znajdź najbliższą partię na lewo
                    console.log("rozstrzygam bliskość do " + party.name);
                    console.log("party_opinion - party.values[axis.order] = " + (party_opinion - party.values[axis.order]));
                    if (party_opinion - party.values[axis.order] < minDifference && party_opinion - party.values[axis.order] >= 0 && party.vote != this.vote) {
                        minDifference = party_opinion - party.values[axis.order];
                        console.log("minDifference = " + (party_opinion - party.values[axis.order]));
                        closestParty = party;
                        console.log("closestParty = " + party.name);
                    }
                }
            }
            else { //PRAWACKA USTAWA
                if (this.vote == Vote.FOR) { //PRAWACKA i głosowano ZA
                    // Znajdź najbliższą partię na lewo
                    console.log("rozstrzygam bliskość do " + party.name);
                    console.log("party_opinion - party.values[axis.order] = " + (party_opinion - party.values[axis.order]));
                    if (party_opinion - party.values[axis.order] < minDifference && party_opinion - party.values[axis.order] >= 0 && party.vote != this.vote) {
                        minDifference = party_opinion - party.values[axis.order];
                        console.log("minDifference = " + (party_opinion - party.values[axis.order]));
                        closestParty = party;
                        console.log("closestParty = " + party.name);
                    }
                }
                else {
                    console.log("rozstrzygam bliskość do " + party.name);
                    console.log("party.values[axis.order] - party_opinion = " + (party.values[axis.order] - party_opinion));
                    if (party.values[axis.order] - party_opinion < minDifference && party.values[axis.order] - party_opinion >= 0 && party.vote != this.vote) {
                        minDifference = party.values[axis.order] - party_opinion;
                        console.log("minDifference = " + (party.values[axis.order] - party_opinion));
                        closestParty = party;
                        console.log("closestParty = " + party.name);
                    }
                }
            }
        }
        if (closestParty == null) {
            return new Party("Niezrzeszeni", 0, [0, 0, 0, 0], "grey");
        }
        return closestParty;
    };
    Party.prototype.getExtremeCount = function () {
        return this.count * 0.05;
    };
    Party.prototype.getLeaningCount = function () {
        return this.count * 0.2;
    };
    Party.prototype.getBasisCount = function () {
        return this.count * 0.5;
    };
    Party.prototype.setVote = function (vote) {
        this.vote = vote;
    };
    Party.prototype.calculateMad = function (legislation, axis) {
        var mad = 0;
        var legislation_value = legislation.values[axis.order];
        console.log("LEGISLATION VALUE: " + legislation_value);
        if (this.vote == Vote.HOLD) {
            return mad;
        }
        if (this.vote == Vote.AGAINST) {
            console.log(this.name + " VOTED AGAINST " + legislation.name);
            if (legislation_value <= 5) {
                console.log(legislation.name + " IS LEWACKA"); //WORKING
                for (var i = 0; i <= legislation_value; i++) {
                    console.log(this.name + " count per opinion " + i + ": " + this.count_per_opinion[axis.order][i]);
                    mad += this.count_per_opinion[axis.order][i];
                }
            }
            else {
                console.log(legislation.name + " IS NOT LEWACKA"); //NOT WORKING
                for (var i = 10; i > legislation_value - 2; i--) {
                    console.log(this.name + " count per opinion " + (i - 1) + ": " + this.count_per_opinion[axis.order][i - 1]);
                    mad += this.count_per_opinion[axis.order][i - 1];
                }
                console.log("MAD: " + mad);
            }
        }
        else if (this.vote == Vote.FOR) {
            console.log(this.name + " VOTED FOR " + legislation.name);
            if (legislation_value <= 5) {
                console.log(legislation.name + " IS LEWACKA");
                //Wkurzą się wszyscy ci, którzy tej ustawy nie popierali: na prawo od 
                for (var i = 10; i > legislation_value + 1; i--) {
                    console.log(this.name + " count per opinion " + (i - 1) + ": " + this.count_per_opinion[axis.order][i - 1]);
                    mad += this.count_per_opinion[axis.order][i - 1];
                }
            }
            else {
                console.log(legislation.name + " IS NOT LEWACKA");
                for (var i = 0; i < legislation_value - 2; i++) {
                    console.log(this.name + " count per opinion " + i + ": " + this.count_per_opinion[axis.order][i]);
                    mad += this.count_per_opinion[axis.order][i];
                }
            }
        }
        return Math.ceil(mad);
    };
    return Party;
}());
var Legislation = /** @class */ (function () {
    function Legislation(name, main_axis, values) {
        this.name = name;
        this.main_axis = main_axis;
        this.values = values;
    }
    return Legislation;
}());
var Vote;
(function (Vote) {
    Vote["FOR"] = "FOR";
    Vote["AGAINST"] = "AGAINST";
    Vote["HOLD"] = "HOLD";
})(Vote || (Vote = {}));
var numberOfAxes = 0;
initialize();
function log(message) {
    var logInput = document.getElementById("log");
    if (logInput) {
        logInput.value += message + "\n"; // Use '\n' for a new line in textarea
        logInput.scrollTop = logInput.scrollHeight; // Scroll to the bottom
    }
}
function calculateChanges(parties, axes, legislation) {
    log("");
    log("Ustawa: " + legislation.name);
    for (var _i = 0, parties_2 = parties; _i < parties_2.length; _i++) {
        var party = parties_2[_i];
        if (party.vote != Vote.HOLD) {
            for (var _a = 0, axes_1 = axes; _a < axes_1.length; _a++) {
                var axis = axes_1[_a];
                if (legislation.values[axis.order] == 0) {
                    continue;
                }
                var mad = party.calculateMad(legislation, axis);
                var furious = Math.ceil(mad / 5);
                //console.log(party.name + " " + axis.name + " Furious: " + furious);
                var closestParty = party.findClosestParty(parties, axis, legislation, party.vote);
                //console.log(party.name + " " + axis.name + " ClosestParty: " + closestParty.name)
                party.count -= furious;
                //console.log(party.name + " " + axis.name + " Party.count - furious: " + party.count)
                if (closestParty == null) {
                    niezrzeszeni += furious;
                }
                else {
                    closestParty.count += furious;
                    //console.log(party.name + " " + axis.name + " ClosestParty.count + furious: " + closestParty.count)
                }
                log(party.name + " on axis " + axis.name + ": " + furious + " going to " + closestParty.name);
            }
        }
        console.log(party.name + " count: " + party.count);
    }
    recalculateCountPerOpinion(parties);
}
function updateCountDisplay(parties) {
    for (var i = 0; i < party_count; i++) {
        var count_display = document.getElementById("pcd_".concat(i));
        count_display.value = parties[i].count.toString();
    }
}
function recalculateCountPerOpinion(parties) {
    for (var _i = 0, parties_3 = parties; _i < parties_3.length; _i++) {
        var party = parties_3[_i];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 10; j++) {
                if (party.values[i] == j - 1 || party.values[i] == j + 3) {
                    party.count_per_opinion[i][j] = party.getExtremeCount();
                }
                else if (party.values[i] == j || party.values[i] == j + 2) {
                    party.count_per_opinion[i][j] = party.getLeaningCount();
                }
                else if (party.values[i] == j + 1) {
                    party.count_per_opinion[i][j] = party.getBasisCount();
                }
                else {
                    party.count_per_opinion[i][j] = 0;
                }
            }
        }
    }
}
function getFor(parties) {
    var count = 0;
    for (var _i = 0, parties_4 = parties; _i < parties_4.length; _i++) {
        var party = parties_4[_i];
        if (party.vote == Vote.FOR)
            count += party.count;
    }
    return count;
}
function getAgainst(parties) {
    var count = 0;
    for (var _i = 0, parties_5 = parties; _i < parties_5.length; _i++) {
        var party = parties_5[_i];
        if (party.vote == Vote.AGAINST)
            count += party.count;
    }
    return count;
}
function getHold(parties) {
    var count = 0;
    for (var _i = 0, parties_6 = parties; _i < parties_6.length; _i++) {
        var party = parties_6[_i];
        if (party.vote == Vote.HOLD)
            count += party.count;
    }
    return count;
}
var niezrzeszeni = 0;
document.getElementById('add_p').addEventListener('click', function () {
    var party_name = document.getElementById('party_name_input');
    createPartyElement(party_name.value);
    party_count++;
    initialize();
});
function generatePartyList() {
    var parties = [];
    for (var i = 0; i < party_count; i++) {
        var name_1 = document.getElementById("pn_".concat(i));
        var count = document.getElementById("pcd_".concat(i));
        var v1 = document.getElementById("pvi_".concat(i, "_A"));
        var v2 = document.getElementById("pvi_".concat(i, "_B"));
        var v3 = document.getElementById("pvi_".concat(i, "_C"));
        var v4 = document.getElementById("pvi_".concat(i, "_D"));
        var color = document.getElementById("party_color_".concat(i));
        var party = new Party(name_1.innerHTML, +count.value, [+v1.value, +v2.value, +v3.value, +v4.value], color.value);
        parties.push(party);
    }
    party_count = parties.length;
    return parties;
}
function setVotes(parties) {
    for (var i = 0; i < party_count; i++) {
        var party = parties[i];
        var checkboxes = document.getElementsByName("v_".concat(i));
        var selectedValue;
        for (var i_1 = 0; i_1 < checkboxes.length; i_1++) {
            var checkbox = checkboxes[i_1];
            if (checkbox.checked) {
                selectedValue = checkbox.value;
                break;
            }
        }
        if (selectedValue == "FOR") {
            party.setVote(Vote.FOR);
        }
        else if (selectedValue == "AGAINST") {
            party.setVote(Vote.AGAINST);
        }
        else if (selectedValue == "HOLD") {
            party.setVote(Vote.HOLD);
        }
    }
}
function setLegislation(axes) {
    var l_name = document.getElementById("ustawa_name_input");
    var l_v1 = document.getElementById("ustawa_input_0");
    var l_v2 = document.getElementById("ustawa_input_1");
    var l_v3 = document.getElementById("ustawa_input_2");
    var l_v4 = document.getElementById("ustawa_input_3");
    return new Legislation(l_name.value, axes[0], [+l_v1.value, +l_v2.value, +l_v3.value, +l_v4.value]);
}
document.getElementById('play_button').addEventListener('click', function () {
    initialize();
    console.log("playing!");
    console.log("Number of parties: " + party_count);
    console.log("Number of parties: " + party_count);
    var legislation = setLegislation(axes);
    console.log(legislation);
    calculateChanges(parties, axes, legislation);
    updateCountDisplay(parties);
    colorCircles();
    console.log("finished calculating changes");
});
function createPartyElement(name) {
    var div = document.createElement('div');
    div.className = 'partia';
    div.innerHTML = "\n    <div class=\"party_header\">\n    <div style=\"padding=\"5px;\" id=\"pn_".concat(party_count, "\" >").concat(name, "</div>\n    <input class=\"party_count_display\" id=\"pcd_").concat(party_count, "\" type=\"number\" min=\"0\" value=\"100\" max=\"460\"/> \n\n    <input type=\"radio\" name=\"v_").concat(party_count, "\" checked value=\"FOR\" id=\"for_").concat(party_count, "\" class=\"for-checkbox\">\n    <input type=\"radio\" name=\"v_").concat(party_count, "\" value=\"AGAINST\" id=\"against_").concat(party_count, "\" class=\"against-checkbox\">\n    <input type=\"radio\" name=\"v_").concat(party_count, "\" value=\"HOLD\" id=\"hold_").concat(party_count, "\" class=\"hold-checkbox\">\n\n    <input type=\"color\" class=\"party_color_input\" value=\"#4C4CFF\" id=\"party_color_").concat(party_count, "\"/>\n    </div>\n\n\n    <div class=\"party_values\">\n    <input class=\"party_value_input\" id=\"pvi_").concat(party_count, "_A\" type=\"number\" min=\"3\" value=\"3\" max=\"8\"/>\n    <input class=\"party_value_input\" id=\"pvi_").concat(party_count, "_B\" type=\"number\" min=\"3\" value=\"3\" max=\"8\"/>\n    <input class=\"party_value_input\" id=\"pvi_").concat(party_count, "_C\" type=\"number\" min=\"3\" value=\"3\" max=\"8\"/>\n    <input class=\"party_value_input\" id=\"pvi_").concat(party_count, "_D\" type=\"number\" min=\"3\" value=\"3\" max=\"8\"/>\n    </div>\n  ");
    var targetColumn = document.getElementById("party_column");
    targetColumn.appendChild(div);
}
var parties;
var party_count = 0;
var axes = [new Axis("A"), new Axis("B"), new Axis("C"), new Axis("D"),];
var party_value_inputs = document.querySelectorAll('.party_value_input');
var party_count_inputs = document.querySelectorAll('.party_count_display');
var party_color_inputs = document.querySelectorAll('.party_color_input');
function initialize() {
    console.log("Initializing");
    parties = generatePartyList();
    setVotes(parties);
    console.log(parties);
    drawOnAxes();
    colorCircles();
    recalculateCountPerOpinion(parties);
    party_value_inputs = document.querySelectorAll('.party_value_input');
    party_value_inputs.forEach(function (input) {
        input.addEventListener('change', initialize);
    });
    party_count_inputs = document.querySelectorAll('.party_count_display');
    party_count_inputs.forEach(function (input) {
        input.addEventListener('change', initialize);
    });
    party_color_inputs = document.querySelectorAll('.party_color_input');
    party_color_inputs.forEach(function (input) {
        input.addEventListener('change', initialize);
    });
}
var axis_element = document.getElementById('axis_element_2_9');
var axis_width = axis_element ? axis_element.offsetWidth : 0;
var axis_height = axis_element ? axis_element.offsetHeight : 0;
function drawOnAxes() {
    var playerElements = document.querySelectorAll('.player');
    playerElements.forEach(function (el) { return el.remove(); });
    var offset = 0;
    for (var _i = 0, parties_7 = parties; _i < parties_7.length; _i++) {
        var party = parties_7[_i];
        for (var i = 0; i <= 3; i++) {
            var axis = document.getElementById("axis_".concat(i));
            var base_position = party.values[i];
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
    var marker = document.createElement('div');
    marker.className = "player";
    marker.style.left = (position - 1) * axis_width + 'px';
    marker.style.width = axis_width + 'px';
    marker.style.height = height + 'px';
    marker.style.backgroundColor = color;
    axis.appendChild(marker);
}
var _loop_1 = function (i) {
    var ui = document.getElementById("ustawa_input_".concat(i));
    ui.addEventListener('input', function () {
        var uid = document.getElementById("ustawa_input_display_".concat(i));
        if (parseInt(ui.value) <= 5) {
            ui.style.accentColor = "green";
        }
        else {
            ui.style.accentColor = "red";
        }
        uid.value = ui.value;
        colorAxisElements(ui.value, i);
    });
};
for (var i = 0; i < 4; i++) {
    _loop_1(i);
}
function colorAxisElements(axis_value, axisIndex) {
    for (var elementIndex = 1; elementIndex <= 10; elementIndex++) {
        var element = document.getElementById("axis_element_".concat(axisIndex, "_").concat(elementIndex));
        if (element) {
            var elementValue = parseInt(element.textContent);
            if (axis_value == 0) {
                element.style.backgroundColor = "white";
                continue;
            }
            if (axis_value == 1)
                element.style.backgroundColor = (elementValue < 3) ? "gold" : "white";
            if (axis_value == 2)
                element.style.backgroundColor = (elementValue < 4) ? "gold" : "white";
            if (axis_value == 3)
                element.style.backgroundColor = (elementValue < 5) ? "gold" : "white";
            if (axis_value == 4)
                element.style.backgroundColor = (elementValue < 6) ? "gold" : "white";
            if (axis_value == 5)
                element.style.backgroundColor = (elementValue < 7) ? "gold" : "white";
            if (axis_value == 6)
                element.style.backgroundColor = (elementValue > 4) ? "gold" : "white";
            if (axis_value == 7)
                element.style.backgroundColor = (elementValue > 5) ? "gold" : "white";
            if (axis_value == 8)
                element.style.backgroundColor = (elementValue > 6) ? "gold" : "white";
            if (axis_value == 9)
                element.style.backgroundColor = (elementValue > 7) ? "gold" : "white";
            if (axis_value == 10)
                element.style.backgroundColor = (elementValue > 8) ? "gold" : "white";
        }
    }
}
function createCircle(i) {
    var circle = document.createElement('div');
    circle.className = 'circle';
    circle.id = "circle_".concat(i);
    return circle;
}
function fillContainerWithCircles(containerId, totalCircles, circlesPerColumn) {
    var container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found');
        return;
    }
    for (var i = 0; i < totalCircles; i++) {
        container.appendChild(createCircle(i));
    }
    var columns = Math.ceil(totalCircles / circlesPerColumn);
    container.style.display = 'grid';
    container.style.gridTemplateColumns = "repeat(".concat(columns, ", 1fr)");
}
fillContainerWithCircles('koryto', 460, 46);
function colorCircles() {
    var coloredCirclesCount = 0;
    for (var _i = 0, parties_8 = parties; _i < parties_8.length; _i++) {
        var party = parties_8[_i];
        for (var i = 0; i < party.count; i++) {
            var circle = document.getElementById("circle_".concat(coloredCirclesCount));
            if (circle) {
                circle.style.backgroundColor = party.color;
                coloredCirclesCount++;
            }
        }
    }
    for (var i = 490; i >= coloredCirclesCount; i--) {
        var circle = document.getElementById("circle_".concat(i));
        if (circle) {
            circle.style.backgroundColor = "gray";
        }
    }
}
