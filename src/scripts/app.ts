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
  let model: Model = new Model(options);
  
  let view: View = new View(options, rootElement);
  let presenter: Presenter = new Presenter(model, view, options);
  presenter.init(); 
  }

  mySlider({verticalView: true,         
    minValue:500, 
    maxValue:1400,
    startRange:600, 
    endRange:800,
    step: 50,           
    useScale: true,
    stepScale: 100,
    feedBack: true,       
    externalRecievers: [document.getElementById('first-input'), document.getElementById('second-input')]}
    , 'div1');

    mySlider({verticalView: false,
      rangeMode: false,         
      minValue:500, 
      maxValue:1000, 
      startRange:600, 
      endRange:900,                 
      useScale: true,
      stepScale: 100,
      feedBack: true,        
      externalRecievers: [document.getElementById('third-input'), document.getElementById('fourth-input')]}
      , 'div2');

      mySlider({verticalView: false,
        rangeMode: true,         
        minValue:500, 
        maxValue:1400,
        noNumericValues: true,
        noNumericScale:{'одни': 1, 'два': 1, 'три': 1, 'четыре': 1, 'пять': 3, 'восемь': 1, 'девять':0},
        startRange:600, 
        endRange:900,                 
        useScale: true,
        stepScale: 100,
        feedBack: true,        
        externalRecievers: [document.getElementById('fifth-input'), document.getElementById('sixth-input')]}
        , 'div4');

}