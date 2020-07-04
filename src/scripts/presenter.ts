/// <reference path="./app.d.ts" />
import { View } from "./view";
import { Model } from "./model";

export class Presenter {
  
  minValue: number;
  maxValue: number;
  startRange: number;
  endRange: number;
  noNumericValue: boolean;

  constructor(options: SliderOptions, view: View, model: Model) {
    //view.init(options.rangeMode, options.feedBack, options.verticalView, undefined, options.useScale);

  }

  init() {

  }

  getSliderData() {

  }

  getRealValue() {
    //перевод из % в единицы измерения слайдера
  }
}