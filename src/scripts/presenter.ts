/// <reference path="./app.d.ts" />
import { View } from "./view";
import { Model } from "./model";

export class Presenter {
  
  minPossibleValue: number;
  maxPossibleValue: number;
  rangePossibleValues: number;
  startSelectedRange: number;
  endSelectedRange: number;
  noNumericValues: boolean;
  noNumericScale: {};
  view: View;
  model: Model;

  constructor(options: SliderOptions, view: View, model: Model) {
    //view.init(options.rangeMode, options.feedBack, options.verticalView, undefined, options.useScale);
    this.minPossibleValue = options.minPossibleValue;
    this.maxPossibleValue = options.maxPossibleValue;
    this.rangePossibleValues = this.maxPossibleValue - this.minPossibleValue;

    if (typeof options.startSelectedRange === 'undefined') {
      this.startSelectedRange = this.minPossibleValue * 1.1;
    } else {
      this.startSelectedRange = options.startSelectedRange
    }

    if (typeof options.endSelectedRange === 'undefined') {
      this.endSelectedRange = this.maxPossibleValue * 0.9;
    } else {
      this.endSelectedRange = options.endSelectedRange;
    }    
    this.noNumericValues = options.noNumericValues
    this.view = view;
    this.model = model;

    //this.init(rootElement, options.rangeMode, options.usefeedBack, options.useScale, options.verticalView);
  }

  init(rootHTMLElement: HTMLElement, rangeMode: boolean, useFeedback: boolean, useScale: boolean, 
      verticalView: boolean, step?: number, sliderTemplate?: {}): void {
    this.view.setBaseConfiguration(rootHTMLElement);
    
    let relativeCurrentValue: number[] = [];    
    if (rangeMode) {
      this.view.setRangeMode();
      relativeCurrentValue = this.getRelativeData( [this.startSelectedRange, this.endSelectedRange] ) as number[];     
    } else {      
      relativeCurrentValue = this.getRelativeData( [this.startSelectedRange] ) as number[];            
    }
    
    if (useFeedback) {      
      this.view.setThumbFeedbacks();
    }

    this.view.setSliderOrientation(verticalView); 
    
    if (useScale) {      
      let scaleData: {} = this.getScaleData(verticalView, sliderTemplate);
      
      if (this.noNumericValues && sliderTemplate) {
        this.noNumericScale = scaleData;
      } else {
        this.noNumericValues = false;
      }

      this.view.setScale(scaleData);
      this.view.setSliderOrientation(verticalView, this.view.sliderScale);
    }   
    
    this.view.setListeners(this.positionHandler.bind(this));

    this.view.setElementPositions(relativeCurrentValue); 
    
    this.model.setCurrentValues(relativeCurrentValue);
    if (step) {
      this.model.setStep(step / this.rangePossibleValues);
    }        
  }

  positionHandler(position: number, index?: number) {
    let currentPosition = this.model.possibleValueAnalysis(position, index);

    if (currentPosition != -1) {
      let feedbackContent: string = ''+ this.getAbsoluteData(currentPosition);

      this.view.setElementPositions(currentPosition, index, feedbackContent);
    }
  }

  getScaleData(verticalView: boolean, sliderTemplate?: {}): {} { //tested
    let sliderSize: number = this.view.getSliderSize();
    
    let result: {} = {};
    if (!sliderTemplate) {
      let markCount: number = sliderSize / 65;
      
      for (let i = 0; i <= markCount; i++) {
        result[i/markCount] = Math.round(this.minPossibleValue + this.rangePossibleValues / markCount * i);
      }
      
    } else {
      let sumProperties: number = 0;
     
      for (let key in sliderTemplate) {
        sumProperties += sliderTemplate[key];        
      }
      let currentSumProperties = 0;
      for (let key in sliderTemplate) {
        currentSumProperties += sliderTemplate[key]
        result[currentSumProperties/sumProperties] = key;
      }
    }
    return result;
  }

  getAbsoluteData(value: number[]): number[]|string[];
  getAbsoluteData(value: number): number|string;
  getAbsoluteData(value: number[]|number): number[]|number|string|string[]{ //tested
    
    if (!this.noNumericValues) {
      if (value instanceof Array) {
        let result: number[] = [];
        value.forEach((item)=> {
          result.push(this.minPossibleValue + item * this.rangePossibleValues);
        })
        return result;
      }
  
      if (typeof value == 'number') {
        return this.minPossibleValue + value * this.rangePossibleValues;
      }
    } else {
      if (value instanceof Array) {
        let result: string[] = [];
        value.forEach((item)=> {
          result.push(this.getStringData(item));
        })
        return result;
      }
  
      if (typeof value == 'number') {
        return this.getStringData(value);
      }
    }
  }

  getRelativeData(value: number[]): number[];
  getRelativeData(value: number): number;
  getRelativeData(value: number[]| number): number[]|number { //tested
    if (value instanceof Array) {
      let result: number[] = [];
      value.forEach((item)=> {
        result.push( (item - this.minPossibleValue) / this.rangePossibleValues);
      })
      return result;      
    }

    if (typeof value == 'number') {
      return (value - this.minPossibleValue) / this.rangePossibleValues;      
    }    
  }

  getStringData(position: number): string { //tested
    let templatePointArray: number[] = Object.keys(this.noNumericScale).map((item)=>{return parseFloat(item)})
    templatePointArray.sort((a,b)=>{return a - b});
        
    for (let i = 0; i <templatePointArray.length; i++) {
      if (position < templatePointArray[i]) {        
        if (i == 0) {          
          return this.noNumericScale[templatePointArray[i]];          
        } else {                  
          if ((templatePointArray[i] + templatePointArray[i-1])/2 > position) {
            return this.noNumericScale[templatePointArray[i - 1]];
          } else {
            return this.noNumericScale[templatePointArray[i]];
          }
        }        
      }    
    }
  }
}