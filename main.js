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
        this.name = name;
        this.count = count;
        this.values = values;
    }
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
var numberOfAxes = 0;
main();
function main() {
    var parties = [];
    var pis = new Party("Prawo i Sprawiedliwość", 153, [4, 3, 7, 7]);
    parties.push(pis);
    var ko = new Party("Koalicja Obywatelska", 153, [6, 5, 4, 4]);
    parties.push(ko);
    var lewica = new Party("Nowa Lewica", 153, [3, 3, 3, 3]);
    parties.push(lewica);
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
}
