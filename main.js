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
function calculateChanges(parties, axes, legislation) {
    for (var _i = 0, parties_5 = parties; _i < parties_5.length; _i++) {
        var party = parties_5[_i];
        if (party.vote != Vote.HOLD) {
            for (var _a = 0, axes_1 = axes; _a < axes_1.length; _a++) {
                var axis = axes_1[_a];
                var mad = party.calculateMad(legislation, axis);
                var furious = Math.ceil(mad / 5);
                console.log(party.name + " " + axis.name + "Mad: " + mad);
                var closestParty = party.findClosestParty(parties, axis, legislation, party.vote);
                console.log(party.name + " " + axis.name + "ClosestParty: " + closestParty.name);
                party.count -= furious;
                console.log(party.name + " " + axis.name + "Party.count - mad: " + party.count);
                if (closestParty == null) {
                    niezrzeszeni += furious;
                }
                else {
                    closestParty.count += furious;
                    console.log(party.name + " " + axis.name + "ClosestParty.count + mad: " + closestParty.count);
                }
            }
        }
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
main();
var niezrzeszeni = 0;
function main() {
    var parties = [];
    var pis = new Party("Prawo i Sprawiedliwość", 115, [4, 3, 7, 7]);
    parties.push(pis);
    var ko = new Party("Koalicja Obywatelska", 115, [6, 5, 4, 4]);
    parties.push(ko);
    var lewica = new Party("Nowa Lewica", 115, [8, 3, 3, 3]);
    parties.push(lewica);
    var konfa = new Party("Konfederacja", 115, [8, 7, 8, 8]);
    parties.push(konfa);
    var axes = [];
    var economic_policy = new Axis("Polityka Ekonomiczna");
    axes.push(economic_policy);
    var fiscal_policy = new Axis("Polityka Fiskalna");
    axes.push(fiscal_policy);
    var culture = new Axis("Kultura");
    axes.push(culture);
    var eu = new Axis("Stosunek do UE");
    axes.push(eu);
    var legislation = new Legislation("Ustawa", economic_policy, [7]);
    pis.voteAtRandom();
    ko.voteAtRandom();
    lewica.voteAtRandom();
    ko.voteAtRandom();
    console.log(parties);
    console.log("Niezrzeszeni: " + niezrzeszeni);
    calculateChanges(parties, axes, legislation);
    console.log(parties);
    console.log("Niezrzeszeni: " + niezrzeszeni);
}
