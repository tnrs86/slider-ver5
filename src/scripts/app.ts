/// <reference path="./app.d.ts" />
/// <reference path="view.ts" />
/// <reference path="presenter.ts" />
/// <reference path="model.ts" />
import { Model } from "./model";
import { View } from "./view";
import { Presenter } from "./presenter";


window.onload = function() {
  let mySlider = function(params: SliderOptions, htmlElement: string) {    
  
  let defaults: SliderOptions =  { verticalView: false,
    rangeMode: true,    
    step: 0    
  };
  
  let options: SliderOptions = {};

  options  = Object.assign(options, defaults, params);
  
  let rootElement = document.getElementById(htmlElement);
  let model: Model = new Model();
  
  let view: View = new View();
  let presenter: Presenter = new Presenter(options, view, model);
  presenter.init(rootElement, options.rangeMode, options.usefeedBack, options.useScale, options.verticalView, options.step, options.noNumericScale); 
  }

  mySlider({verticalView: true,         
    minPossibleValue:500, 
    maxPossibleValue:1400,
    startSelectedRange:600, 
    endSelectedRange:800,
    step: 150,           
    useScale: true,
    stepScale: 100,
    usefeedBack: true,       
    externalRecievers: [document.getElementById('first-input'), document.getElementById('second-input')]}
    , 'div1');

    mySlider({verticalView: false,
      rangeMode: false,         
      minPossibleValue:500, 
      maxPossibleValue:1000, 
      startSelectedRange:600, 
      endSelectedRange:900,                 
      useScale: true,
      stepScale: 100,
      usefeedBack: true,        
      externalRecievers: [document.getElementById('third-input'), document.getElementById('fourth-input')]}
      , 'div2');

      mySlider({verticalView: false,
        rangeMode: true,         
        minPossibleValue:500, 
        maxPossibleValue:1400,
        noNumericValues: true,
        noNumericScale:{'одни': 0, 'два': 1, 'три': 1, 'четыре': 1, 'пять': 1, 'восемь': 3, 'девять':1},
        startSelectedRange:600, 
        endSelectedRange:900,                 
        useScale: true,
        stepScale: 100,
        usefeedBack: true,        
        externalRecievers: [document.getElementById('fifth-input'), document.getElementById('sixth-input')]}
        , 'div4');

}