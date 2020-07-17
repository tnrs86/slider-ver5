/// <reference path="./app.d.ts" />
import { View } from "./view";
import { Model } from "./model";

export class Presenter {
  
  minPossibleValue: number;
  maxPossibleValue: number;
  rangePossibleValues: number;
  //startSelectedRange: number;
  //endSelectedRange: number;
  currentRange: number[] = [];
  noNumericValues: boolean;
  noNumericScale: {};
  view: View;
  model: Model;
  scalePointCount: number;
  scaleTick: number = 65;
  constructor(options: SliderOptions, view: View, model: Model) {
    //view.init(options.rangeMode, options.feedBack, options.verticalView, undefined, options.useScale);
    this.minPossibleValue = options.minPossibleValue;
    this.maxPossibleValue = options.maxPossibleValue;
    this.rangePossibleValues = this.maxPossibleValue - this.minPossibleValue;

    if (typeof options.startSelectedRange === 'undefined') {
      //this.startSelectedRange = this.minPossibleValue * 1.1;
      this.currentRange.push(this.minPossibleValue * 1.1);
    } else {
      //this.startSelectedRange = options.startSelectedRange;
      this.currentRange.push(options.startSelectedRange);
    }

    if (typeof options.endSelectedRange === 'undefined') {
      //this.endSelectedRange = this.maxPossibleValue * 0.9;
      this.currentRange.push(this.maxPossibleValue * 0.9);
    } else {
      //this.endSelectedRange = options.endSelectedRange;
      this.currentRange.push(options.endSelectedRange);
    }    
    this.noNumericValues = options.noNumericValues
    this.view = view;
    this.model = model;
  }

  init(options: SliderOptions, rootHTMLElement: HTMLElement): void {
    this.view.setBaseConfiguration(rootHTMLElement);
    
    let relativeCurrentValue: number[] = [];    
    if (options.rangeMode) {
      this.view.setRangeMode();
      //relativeCurrentValue = this.getRelativeData( [this.startSelectedRange, this.endSelectedRange] ) as number[];     
    } else {      
     //relativeCurrentValue = this.getRelativeData( [this.startSelectedRange] ) as number[];            
    }
    relativeCurrentValue = this.getRelativeData(this.currentRange) as number[];
    
    if (options.usefeedBack) {      
      this.view.setThumbFeedbacks();
    }

    this.view.setSliderOrientation(options.verticalView); 
    
    if (options.useScale) {      
      let scaleData: {} = this.getScaleData(options.noNumericScale);
      
      if (this.noNumericValues && options.noNumericScale) {
        this.noNumericScale = scaleData;
      } else {
        this.noNumericValues = false;
      }

      this.view.setScale(scaleData);
      this.view.setSliderOrientation(options.verticalView, this.view.sliderScale);
    }   
    
    this.view.setListeners(this.positionHandler.bind(this), this.resizeHandler.bind(this));

    this.view.setElementPositions(relativeCurrentValue); 
    
    this.model.setCurrentValues(relativeCurrentValue);
    if (options.step) {
      this.model.setStep(options.step / this.rangePossibleValues);
    }
    
    this.view.setControlPanel(rootHTMLElement, options.externalRecievers[0], options.externalRecievers[1]);
    this.view.setControlPanelParameters({'min-value': this.minPossibleValue, 
                                        'max-value': this.maxPossibleValue, 
                                        'step': options.step, 
                                        'scale': options.useScale, 
                                        'vertical': options.verticalView, 
                                        'feedback': options.usefeedBack,
                                        'range-mode': options.rangeMode});

    this.view.setControlPanelListener(this.controlDataHandler.bind(this));
  }

  positionHandler(position: number, index?: number) {
    let currentPosition = this.model.possibleValueAnalysis(position, index);

    if (currentPosition != -1) {
      let absoluteData: number = this.getAbsoluteData(currentPosition) as number;
      
      this.currentRange[index] = absoluteData;

      let feedbackContent: string = ''+ absoluteData;
      this.view.setElementPositions(currentPosition, index, feedbackContent);
    }
  }

  resizeHandler(): void {
    if (this.checkChangeScale()) {
      this.view.removeScale();
      this.view.setScale(this.getScaleData());
      this.view.setSliderOrientation(undefined, this.view.sliderScale);
    }
  }

  externalDataHandler(value: string, index: number) {
    let position: number = this.getRelativeData(parseInt(value)) as number;
    let currentPosition = this.model.possibleValueAnalysis(position, index);

    if (currentPosition != -1) {
      let feedbackContent: string = ''+ this.getAbsoluteData(currentPosition);

      this.view.setElementPositions(currentPosition, index, feedbackContent);
    }  
  }

  controlDataHandler(value: number| boolean, hint: string) {
    let relativeCurrentValue: number[];
    switch (true) {
      case hint == 'min-value':
        this.minPossibleValue = value as number;
        this.rangePossibleValues = this.maxPossibleValue - this.minPossibleValue;
        relativeCurrentValue = this.getRelativeData(this.currentRange) as number[];
        this.view.setElementPositions(relativeCurrentValue);
        
        if (this.view.sliderScale) {          
          this.view.removeScale();
          this.view.setScale(this.getScaleData());
          this.view.setSliderOrientation(this.view.verticalView, this.view.sliderScale);
        }
        break;
      case hint == 'max-value':
        this.maxPossibleValue = value as number;
        this.rangePossibleValues = this.maxPossibleValue - this.minPossibleValue;
        relativeCurrentValue = this.getRelativeData(this.currentRange) as number[];
        this.view.setElementPositions(relativeCurrentValue);
        
        if (this.view.sliderScale) {          
          this.view.removeScale();
          this.view.setScale(this.getScaleData());
          this.view.setSliderOrientation(this.view.verticalView, this.view.sliderScale);
        }
        break;
      case hint == 'step':
        this.model.setStep(value as number / this.rangePossibleValues);
        break;
      case hint == 'scale':
        console.log(value)
        if (value) {
          if (!this.view.sliderScale) {
            let scaleData: {} = this.getScaleData(this.noNumericScale);
            this.view.setScale(scaleData);
            this.view.setSliderOrientation(this.view.verticalView, this.view.sliderScale);
          }
        } else {
          if (this.view.sliderScale) {
            this.view.removeScale()
          }
        }
        break;
      case hint == 'vertical':
        if (value !== this.view.verticalView) {
          this.view.setSliderOrientation(value as boolean);
          relativeCurrentValue = this.getRelativeData(this.currentRange) as number[];
          this.view.setElementPositions(relativeCurrentValue);
          
          if (this.view.sliderScale && this.checkChangeScale()) {
            this.view.removeScale();
            this.view.setScale(this.getScaleData());
            this.view.setSliderOrientation(undefined, this.view.sliderScale);
          }
        }
        break;
      case hint == 'feedback':
        
        if (value !== this.view.useFeedback) {          
          if (value) {
            console.log('fb')
            this.view.setThumbFeedbacks();
          } else {
            this.view.removeThumbFeedback();
          }
        }
        break;
      
      case hint == 'range-mode':
        if (value !== this.view.rangeMode) {
          if (value) {
            this.view.setRangeMode();
            this.view.setSliderOrientation(undefined, this.view.sliderThumbs[1]);
            this.view.setSliderOrientation(undefined, this.view.sliderFiller);
            this.model.currentValues.push(this.model.currentValues[0] * 1.5);
            this.view.setElementPositions(this.model.currentValues);
            if (this.view.setThumbFeedbacks) {
              this.view.setThumbFeedbacks();
            }
          } else {
            this.view.setSingleMode();
            this.model.currentValues.length = 1;
          }
        }
      default:       
    }
  }

  getScaleData(sliderTemplate?: {}): {} { //tested
    let sliderSize: number = this.view.getSliderSize();
    
    let result: {} = {};
    if (!sliderTemplate) {
      let markCount: number = Math.floor(sliderSize / this.scaleTick);
      this.scalePointCount = markCount;
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

  /*getAbsoluteData(value: number[]): number[]|string[];
  getAbsoluteData(value: number): number|string;*/
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

  /*getRelativeData(value: number[]): number[];
  getRelativeData(value: number): number;*/
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

  checkChangeScale():boolean { //tested
    
    if (this.noNumericScale) {
      return false;
    }

    if (Math.floor(this.view.getSliderSize() / this.scaleTick) != this.scalePointCount) {
      return true;
    }
    return false;
  }
}