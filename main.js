var Axis = /** @class */ (function () {
    function Axis(name) {
        this.name = name;
        this.order = numberOfAxes;
        numberOfAxes++;
    }
    return Axis;
}());
var Party = /** @class */ (function () {
    function Party(name, count, values) {
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
        var closestParty = null;
        var minDifference = Number.MAX_VALUE;
        var party_opinion = this.values[axis.order];
        if (vote == Vote.HOLD) {
            return this;
        }
        for (var party in parties) {
        }
        if (vote == Vote.FOR) {
            if (legislation.values[axis.order] <= 5) {
                for (var _i = 0, parties_1 = parties; _i < parties_1.length; _i++) {
                    var party = parties_1[_i];
                    var difference = party_opinion - party.values[axis.order];
                    if (difference < minDifference && difference <= 0 && party.vote != this.vote) {
                        minDifference = difference;
                        closestParty = party;
                    }
                }
            }
            else {
                for (var _a = 0, parties_2 = parties; _a < parties_2.length; _a++) {
                    var party = parties_2[_a];
                    var difference = party_opinion - party.values[axis.order];
                    if (difference < minDifference && difference >= 0 && party.vote != this.vote) {
                        minDifference = difference;
                        closestParty = party;
                    }
                }
            }
        }
        else if (vote == Vote.AGAINST) {
            if (legislation.values[axis.order] <= 5) {
                for (var _b = 0, parties_3 = parties; _b < parties_3.length; _b++) {
                    var party = parties_3[_b];
                    var difference = party_opinion - party.values[axis.order];
                    if (difference < minDifference && difference >= 0 && party.vote != this.vote) {
                        minDifference = difference;
                        closestParty = party;
                    }
                }
            }
            else {
                for (var _c = 0, parties_4 = parties; _c < parties_4.length; _c++) {
                    var party = parties_4[_c];
                    var difference = party_opinion - party.values[axis.order];
                    if (difference < minDifference && difference <= 0 && party.vote != this.vote) {
                        minDifference = difference;
                        closestParty = party;
                    }
                }
            }
        }
        if (closestParty == null) {
            return new Party("Niezrzeszeni", 0, [5, 6, 5, 6]);
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
        if (this.vote == Vote.HOLD) {
            return mad;
        }
        if (legislation.values[axis.order] <= 5) {
            var tolerance_barrier = legislation.values[axis.order] + 1;
            if (this.vote == Vote.FOR) { //LEWICOWA ZA
                for (var i = 9; i > tolerance_barrier - 1; i--) {
                    mad += this.count_per_opinion[axis.order][i];
                }
            }
            else { // LEWICOWA PRZECIW ???
                for (var i = 0; i <= tolerance_barrier; i++) {
                    mad += this.count_per_opinion[axis.order][i];
                }
            }
        }
        else {
            var tolerance_barrier = legislation.values[axis.order] - 1;
            if (this.vote == Vote.FOR) { //PRAWICOWA ZA
                for (var i = 0; i < tolerance_barrier; i++) {
                    mad += this.count_per_opinion[axis.order][i];
                }
            }
            else { //PRAWICOWA PRZECIW
                for (var i = 9; i >= tolerance_barrier - 1; i--) {
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
function log(message) {
    var logInput = document.getElementById("log");
    if (logInput) {
        logInput.value += message + "\n"; // Use '\n' for a new line in textarea
        logInput.scrollTop = logInput.scrollHeight; // Scroll to the bottom
    }
}
function calculateChanges(parties, axes, legislation) {
    for (var _i = 0, parties_5 = parties; _i < parties_5.length; _i++) {
        var party = parties_5[_i];
        if (party.vote != Vote.HOLD) {
            for (var _a = 0, axes_1 = axes; _a < axes_1.length; _a++) {
                var axis = axes_1[_a];
                var mad = party.calculateMad(legislation, axis);
                var furious = Math.ceil(mad / 5);
                log(party.name + " " + axis.name + " Furious: " + furious);
                var closestParty = party.findClosestParty(parties, axis, legislation, party.vote);
                log(party.name + " " + axis.name + " ClosestParty: " + closestParty.name);
                party.count -= furious;
                log(party.name + " " + axis.name + " Party.count - furious: " + party.count);
                if (closestParty == null) {
                    niezrzeszeni += furious;
                }
                else {
                    closestParty.count += furious;
                    log(party.name + " " + axis.name + " ClosestParty.count + furious: " + closestParty.count);
                }
            }
        }
        var count_display = document.getElementById("pcd_".concat(party.order));
        count_display.value = party.count.toString();
    }
    recalculateCountPerOpinion(parties);
}
function recalculateCountPerOpinion(parties) {
    for (var _i = 0, parties_6 = parties; _i < parties_6.length; _i++) {
        var party = parties_6[_i];
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
    for (var _i = 0, parties_7 = parties; _i < parties_7.length; _i++) {
        var party = parties_7[_i];
        if (party.vote == Vote.FOR)
            count += party.count;
    }
    return count;
}
function getAgainst(parties) {
    var count = 0;
    for (var _i = 0, parties_8 = parties; _i < parties_8.length; _i++) {
        var party = parties_8[_i];
        if (party.vote == Vote.AGAINST)
            count += party.count;
    }
    return count;
}
function getHold(parties) {
    var count = 0;
    for (var _i = 0, parties_9 = parties; _i < parties_9.length; _i++) {
        var party = parties_9[_i];
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
});
document.getElementById('play_button').addEventListener('click', function () {
    console.log("playing!");
    console.log(party_count);
    var parties = [];
    for (var i = 0; i < party_count; i++) {
        var name_1 = document.getElementById("pn_".concat(i));
        var count = document.getElementById("pcd_".concat(i));
        var v1 = document.getElementById("pvi_".concat(i, "_A"));
        var v2 = document.getElementById("pvi_".concat(i, "_B"));
        var v3 = document.getElementById("pvi_".concat(i, "_C"));
        var v4 = document.getElementById("pvi_".concat(i, "_D"));
        var party = new Party(name_1.innerHTML, +count.value, [+v1.value, +v2.value, +v3.value, +v4.value]);
        parties.push(party);
    }
    console.log(parties);
    for (var i = 0; i < party_count; i++) {
        var party = parties[i];
        console.log("calculating vote for party " + party.name + "Here is their party order: " + party.order);
        var checkboxes = document.getElementsByName("v_".concat(i));
        console.log(checkboxes);
        var selectedValue;
        for (var i_1 = 0; i_1 < checkboxes.length; i_1++) {
            var checkbox = checkboxes[i_1];
            if (checkbox.checked) {
                console.log(checkbox.value);
                console.log(checkbox.checked);
                selectedValue = checkbox.value;
                break;
            }
        }
        console.log("Selected value: " + selectedValue);
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
    console.log(parties);
    var l_name = document.getElementById("ustawa_name_input");
    var l_v1 = document.getElementById("ustawa_input_0");
    var l_v2 = document.getElementById("ustawa_input_1");
    var l_v3 = document.getElementById("ustawa_input_2");
    var l_v4 = document.getElementById("ustawa_input_3");
    var axes = [new Axis("A"), new Axis("B"), new Axis("C"), new Axis("D"),];
    var legislation = new Legislation(l_name.value, axes[0], [+l_v1.value, +l_v2.value, +l_v3.value, +l_v4.value]);
    console.log(legislation);
    calculateChanges(parties, axes, legislation);
    console.log("finished calculating changes");
    console.log(parties);
});
var party_count = 0;
function createPartyElement(name) {
    var div = document.createElement('div');
    div.className = 'partia';
    div.innerHTML = "\n    <div class=\"party_header\">\n    <div style=\"padding=\"5px;\" id=\"pn_".concat(party_count, "\" >").concat(name, "</div>\n    <input class=\"party_count_display\" id=\"pcd_").concat(party_count, "\" type=\"number\" min=\"0\" value=\"150\" max=\"460\"/> \n\n    <input type=\"radio\" name=\"v_").concat(party_count, "\" checked value=\"FOR\" id=\"for_").concat(party_count, "\" class=\"for-checkbox\">\n    <input type=\"radio\" name=\"v_").concat(party_count, "\" value=\"AGAINST\" id=\"against_").concat(party_count, "\" class=\"against-checkbox\">\n    <input type=\"radio\" name=\"v_").concat(party_count, "\" value=\"HOLD\" id=\"hold_").concat(party_count, "\" class=\"hold-checkbox\">\n\n    </div>\n\n\n    <div class=\"party_values\">\n    <input class=\"party_value_input\" id=\"pvi_").concat(party_count, "_A\" type=\"number\" min=\"1\" value=\"3\" max=\"10\"/>\n    <input class=\"party_value_input\" id=\"pvi_").concat(party_count, "_B\" type=\"number\" min=\"1\" value=\"3\" max=\"10\"/>\n    <input class=\"party_value_input\" id=\"pvi_").concat(party_count, "_C\" type=\"number\" min=\"1\" value=\"3\" max=\"10\"/>\n    <input class=\"party_value_input\" id=\"pvi_").concat(party_count, "_D\" type=\"number\" min=\"1\" value=\"3\" max=\"10\"/>\n    </div>\n  ");
    var targetColumn = document.getElementById("party_column");
    targetColumn.appendChild(div);
}
