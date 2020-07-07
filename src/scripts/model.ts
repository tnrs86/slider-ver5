import { resetHistory } from "sinon";

export class Model {
  currentValues: number[] = [];
  step: number;
  rangeMode: boolean;
  setCurrentValues(values: number[]| number, index?: number): void { //tested
    if (typeof values == 'object' &&  typeof index == 'undefined') {
      this.currentValues = values as number[];
    } else if (typeof values == 'number' &&  typeof index == 'number') {
      this.currentValues[index] = values;
    } else {
      //bug
    }
     
  }

  getCurrenValues(): number[] { //tested
    return this.currentValues;
  }

  possibleValueAnalysis(possibleValue: number, index?: number): number {
    if (this.checkValues(possibleValue)) {
      if (!index) {
        index = this.findRangeEdge(possibleValue);
      }

      if (this.checkPossibleMove(possibleValue, index)) {
        let result = this.calcCurrentValue(possibleValue, index);
        this.setCurrentValues(result, index);
        return result;
      }
    }

    return -1;
  }

  checkValues(values: number): boolean {    
    
    if (values > 1 || values < 0) return false;

    return true;

  }

  /*findChange(values: number[]): number {
    let result: number;

    return result;
  }*/

  checkPossibleMove(values: number, index: number):boolean { //tested
    if (this.step) {
      if (Math.abs(this.currentValues[index] - values) < this.step) return false;
    }

    if (this.currentValues.length > 1) {
      let testValues: number[] = [];
      Object.assign(testValues, this.currentValues);
      testValues[index] = values;
      
      if (testValues[0] > testValues[1]) return false;
    }

    return true;
  }

  findRangeEdge(possibleValue: number): number { //tested
    
    switch (true) {
      case (possibleValue < this.currentValues[0]):
        return 0;

      case (possibleValue > this.currentValues[1]):
        return 1;

      case (possibleValue < (this.currentValues[0] + (this.currentValues[1] - this.currentValues[0])/2)):
        return 0;
      
      default:
        return 1;
    }
    
  }

  calcCurrentValue(possibleValue: number, index: number): number { //tested
    let result: number;
    if (this.step) {
      let stepCount: number = parseInt(''+(possibleValue - this.currentValues[index]) / this.step);
      let width
      return parseFloat((this.currentValues[index] + stepCount * this.step).toFixed(2));
    } else {
      return possibleValue;
    }
    
  }


}