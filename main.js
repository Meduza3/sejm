var message = 'Hello World';
console.log(message);
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
        this.vote = Vote.Hold;
        this.count_per_opinion = [];
        this.name = name;
        this.count = count;
        this.values = values;
        for (var i = 0; i <= 4; i++) {
            for (var j = 0; j <= 10; j++) {
                if (this.values[i] == j - 2 || this.values[i] == j + 2) {
                    this.count_per_opinion[i][j] == this.getExtremeCount();
                }
                else if (this.values[i] == j - 1 || this.values[i] == j + 1) {
                    this.count_per_opinion[i][j] == this.getLeaningCount();
                }
                else if (this.values[i] == j) {
                    this.count_per_opinion[i][j] == this.getBasisCount();
                }
                else {
                    this.count_per_opinion[i][j] == 0;
                }
            }
        }
    }
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
    Party.prototype.calculateMadPerAxis = function (legislation, axis) {
        var party_opinion = this.values[axis.order];
        var legislation_value = legislation.values[axis.order];
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
    Vote[Vote["For"] = 0] = "For";
    Vote[Vote["Against"] = 1] = "Against";
    Vote[Vote["Hold"] = 2] = "Hold";
})(Vote || (Vote = {}));
var numberOfAxes = 0;
function calculateChanges(parties, legislation) {
    for (var _i = 0, parties_1 = parties; _i < parties_1.length; _i++) {
        var party = parties_1[_i];
        // party.calculateAngryCount();
    }
}
main();
function main() {
    var parties = [];
    var niezrzeszeni = 0;
    var pis = new Party("Prawo i Sprawiedliwość", 115, [4, 3, 7, 7]);
    parties.push(pis);
    var ko = new Party("Koalicja Obywatelska", 115, [6, 5, 4, 4]);
    parties.push(ko);
    var lewica = new Party("Nowa Lewica", 115, [3, 3, 3, 3]);
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
    console.log(parties, axes);
    var invitro = new Legislation("Finansowanie in Vitro", fiscal_policy, [-1, 4, 4, -1]);
    pis.setVote(Vote.Against);
    konfa.setVote(Vote.Hold);
    lewica.setVote(Vote.For);
    ko.setVote(Vote.For);
    calculateChanges(parties, invitro);
}
