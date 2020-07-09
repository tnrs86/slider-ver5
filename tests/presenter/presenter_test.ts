/// <reference path="../../src/scripts/app.d.ts" />
import { Presenter } from '../../src/scripts/presenter';

import { expect } from 'chai';
import * as sinon from 'sinon';
import { View, Slider, SliderTrack } from '../../src/scripts/view';
import { Model } from '../../src/scripts/model';
import { assert } from 'chai';

/*let viewStub: View = sinon.stub(View.prototype);
let modelStub: Model = sinon.stub(Model.prototype);*/

describe('Проверка методов класса Presenter', ()=> {
  let testView: View = new View();
  let testModel: Model = new Model();
  describe('Проверка метода getAbsoluteData(value: number[]| number): number[]|number, '+
  'который преобразовывает относительные величины (доли единицы) в абсолютные (в единицах измерения слайдера)', ()=> {
    let testOptions: SliderOptions = {
      minPossibleValue: 300,
      maxPossibleValue: 1300
    }
    let testPresenter = new Presenter(testOptions, testView, testModel);
    it('Передача методу единичного значения', ()=> {      
      assert.equal(testPresenter.getAbsoluteData(0.6), 900);      
    })

    it('Передача методу массива значений', ()=> {
      assert.deepEqual(testPresenter.getAbsoluteData([0.3, 0.8]), [600, 1100]);
    })
    
  })

  describe('Проверка метода getRelativeData(value: number[]| number): number[]|number, '+
  'преобразующего абсолютные величины (в единицах измерения слайдера) в относительные (доли единицы)', ()=> {
    let testOptions: SliderOptions = {
      minPossibleValue: 1000,
      maxPossibleValue: 1500
    }
    
    let testPresenter = new Presenter(testOptions, testView, testModel);

    it('Передача методу единичного значения', ()=> {
      assert.equal(testPresenter.getRelativeData(1100), 0.2);
    })

    it('Передача методу массива значений', ()=> {
      assert.deepEqual(testPresenter.getRelativeData([1200, 1400]), [2/5, 4/5]);
    })

  })

  describe('Проверка метода getScaleData(): {}, возвращающего объект , '+
  'содержащий данные для построения шкалы слайдера (со свойствами в формате {доля шкалы: подпись})', ()=> {
    
    let testView: View = new View();    
    let rootHTML = document.createElement('div');
    document.getElementsByTagName('body')[0].append(rootHTML);
    let sliderHTMLObject = document.createElement('div');
    rootHTML.appendChild(sliderHTMLObject);
    testView.sliderTrack = sinon.createStubInstance(SliderTrack);    
    testView.sliderTrack.htmlObject = sliderHTMLObject;

    it('Проверка базового алгоритма метода (без видоизменяющих опций)', ()=> {
      testView.verticalView = true;
      sliderHTMLObject.style.height = '325px';
      let testOptions: SliderOptions = {
        minPossibleValue: 500,
        maxPossibleValue: 1500
      }

      let testPresenter: Presenter = new Presenter(testOptions, testView, testModel);
      let correctAnsver: {} = {0: 500, 0.2: 700, 0.4: 900, 0.6: 1100, 0.8: 1300, 1: 1500};
      
      assert.deepEqual(testPresenter.getScaleData(true), correctAnsver);
    })

    it('Проверка работоспособности метода при наличии шаблона шкалы слайдера. '+
    'Шаблон слайдера - объект вида {значение: расстояние от предыдущей метки}, '+
    'ключ "значение" может задаваться как в числовом, так и в строковом формате'+
    '"расстояние до следующей метки" задается в относительном или в абсолютном форматах', ()=> {
      testView.verticalView = false;
      sliderHTMLObject.style.width = '600px';
      let testOptions: SliderOptions = {
        minPossibleValue: 500,
        maxPossibleValue: 1500        
      }
      sinon.spy(HTMLElement.prototype, '');
      let noNumericScale:{} = {'один': 0, 'два': 1, 'три': 1, 'четыре': 1, 'пять': 1, 'девять': 4, 'десять': 1, 'одиннадцать': 1};
      let testPresenter: Presenter = new Presenter(testOptions, testView, testModel);
      let correctAnsver: {} = {0: 'один', 0.1: 'два', 0.2: 'три', 0.3: 'четыре', 0.4: 'пять', 0.8: 'девять', 0.9: 'десять', 1: 'одиннадцать'};
      
      assert.deepEqual(testPresenter.getScaleData(false, noNumericScale), correctAnsver);
    })
  })

  describe('Проверка метода getStringData(position: number): string, '+
  'преобразующего числовые значения в текстовые на основе шаблона. Шаблон - объект с данными, полученный при создании шкалы слайдера', ()=> {
    let testOptions: SliderOptions = {
      minPossibleValue: 1000,
      maxPossibleValue: 1500
    }
    let scaleData: {} = {0: 'один', 0.2: 'два', 0.4: 'три', 0.6: 'четыре', 0.8: 'пять', 1: 'шесть'};
    let testPresenter = new Presenter(testOptions, testView, testModel);
    testPresenter.noNumericScale = scaleData;
    it('Проверка 1. Аргумент метода равен "0.4"', ()=> {
      assert.equal(testPresenter.getStringData(0.4), 'три');
    })

    it('Проверка 2. Аргумент метода равен "0.5"', ()=> {
      assert.equal(testPresenter.getStringData(0.5), 'четыре');
    })

    it('Проверка 3. Аргумент метода равен "0.93"', ()=> {
      assert.equal(testPresenter.getStringData(0.92), 'шесть');
    })

  })
})