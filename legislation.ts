export class Legislation {
    name: string;
    main_axis: Axis;
    values: number[];

    constructor(name: string, main_axis: Axis, values: number[]){
        this.name = name;
        this.main_axis = main_axis;
        this.values = values;
    }

}