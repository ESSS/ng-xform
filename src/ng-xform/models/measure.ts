export class Measure {
  value: number;
  unit: string;

  constructor(value: number, unit: string) {
    this.unit = unit;
    this.value = value;
  }
}
