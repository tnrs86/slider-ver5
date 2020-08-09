/// <reference path="../../src/scripts/app.d.ts" />
import { Presenter } from '../../src/scripts/presenter';

import { expect } from 'chai';
import * as sinon from 'sinon';
import { View, Slider, SliderTrack, SliderScale } from '../../src/scripts/view';
import { Model } from '../../src/scripts/model';
import { assert } from 'chai';

import { JSDOM } from 'jsdom';
import Sinon = require('sinon');
//import Sinon from ('sinon');
const { document } = (new JSDOM('<!DOCTYPE html><body><p>Hello world</p></body></html>')).window;
global.document = document;
global.window = document.defaultView;
global.HTMLElement = document.defaultView.HTMLElement;
/*let viewStub: View = sinon.stub(View.prototype);
let modelStub: Model = sinon.stub(Model.prototype);*/

describe('Проверка методов класса Presenter', ()=> {
  let testView: View = new View();
  let testModel: Model = new Model();

  describe('Проверка метода init(options: SliderOptions, rootHTMLElement: HTMLElement): void. '+
  'Метод передает все настройки в модули Presenter и View, а так же запускает отрисовку слайдера на веб странице.', ()=> {
    
    let firstInput: HTMLInputElement = document.createElement('input') as HTMLInputElement;
    let secondInput: HTMLInputElement = document.createElement('input') as HTMLInputElement;

    let optionsCollection: SliderOptions[] = [
      { minPossibleValue: 100,
        maxPossibleValue: 200,
        rangeMode: true,
        startSelectedRange: 150,
        endSelectedRange: 190,
        step: undefined,
        useScale: true,        
        noNumericValues: false,
        noNumericScale: {},
        externalRecievers: [firstInput, secondInput],
        usefeedBack: true, 
        verticalView: true },

        { minPossibleValue: 300,
          maxPossibleValue: 800,
          rangeMode: false,
          startSelectedRange: 400,
          endSelectedRange: 600,
          step: 1,
          useScale: false,        
          noNumericValues: true,
          noNumericScale: {'one': 1, 'two': 2, 'three': 3},
          externalRecievers: [firstInput, secondInput],
          usefeedBack: false, 
          verticalView: false }
    ]

    let setBaseConfigurationSpy: Sinon.SinonStub;
    let setRangeModeSpy: Sinon.SinonStub;
    let getRelativeDataSpy: Sinon.SinonStub; //pres
    let setThumbFeedbacksSpy: Sinon.SinonStub;
    let setSliderOrientationSpy: Sinon.SinonStub;
    let getScaleDataSpy: Sinon.SinonStub;
    let setScaleSpy: Sinon.SinonStub;
    let setListenersSpy: Sinon.SinonStub;
    let setElementPositionsSpy: Sinon.SinonStub;
    let setCurrentValuesSpy: Sinon.SinonStub; //view
    let setStepSpy: Sinon.SinonStub; //view
    let setControlPanelSpy: Sinon.SinonStub;
    let setControlPanelParametersSpy: Sinon.SinonStub;
    let setControlPanelListenerSpy: Sinon.SinonStub;

    let ansvers: number[] = [14, 10];

    before(()=> {
       setBaseConfigurationSpy = sinon.stub(View.prototype, 'setBaseConfiguration');
       setRangeModeSpy = sinon.stub(View.prototype, 'setRangeMode');
       getRelativeDataSpy = sinon.stub(Presenter.prototype, 'getRelativeData'); //pres
       setThumbFeedbacksSpy = sinon.stub(View.prototype, 'setThumbFeedbacks');
       setSliderOrientationSpy = sinon.stub(View.prototype, 'setSliderOrientation');
       getScaleDataSpy = sinon.stub(Presenter.prototype, 'getScaleData');
       setScaleSpy = sinon.stub(View.prototype, 'setScale');
       setListenersSpy = sinon.stub(View.prototype, 'setListeners');
       setElementPositionsSpy = sinon.stub(View.prototype, 'setElementPositions');
       setCurrentValuesSpy = sinon.stub(Model.prototype, 'setCurrentValues'); //model
       setStepSpy = sinon.stub(Model.prototype, 'setStep');//model
       setControlPanelSpy = sinon.stub(View.prototype, 'setControlPanel');
       setControlPanelParametersSpy = sinon.stub(View.prototype, 'setControlPanelParameters');
       setControlPanelListenerSpy = sinon.stub(View.prototype, 'setControlPanelListener');
    })

    afterEach(()=> {
      sinon.resetHistory();
    })

    after(()=> {
      sinon.restore();
    })

    optionsCollection.forEach((options, index)=>{
      it('Тест №' + index, ()=> {
        let testPresenter = new Presenter(options, testView, testModel);

        testPresenter.init(options, document.createElement('div'));
        let result: number =  setBaseConfigurationSpy.callCount + setRangeModeSpy.callCount + getRelativeDataSpy.callCount +
            setThumbFeedbacksSpy.callCount + setSliderOrientationSpy.callCount + getScaleDataSpy.callCount + 
            setScaleSpy.callCount + setListenersSpy.callCount + setElementPositionsSpy.callCount + 
            setCurrentValuesSpy.callCount + setStepSpy.callCount + setControlPanelSpy.callCount + 
            setControlPanelParametersSpy.callCount + setControlPanelListenerSpy.callCount;

        assert.equal(result, ansvers[index]);
      })
    })

  })


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
    describe('Проверка при использовании нецифровых показаний слайдера', ()=> {
    //сделать заглушку на getStringdata и протестировать на факт вызова
      let i: number;
      before(()=> {
        
        sinon.stub(Presenter.prototype, 'getStringData').callsFake(()=>{
          i++
          return ''
        });
      })

      after(()=> {
        sinon.restore();
      })

      beforeEach(()=> {
        i = 0;
      })

      it('В качестве аргумента передан массив с числами', ()=>{      
        let testPresenter = new Presenter(testOptions, testView, testModel);
        testPresenter.noNumericValues = true;
        testPresenter.getAbsoluteData([0.3, 0.8, 0.9])
        assert.equal(i, 3);      
      })

      it('В качестве аргумента передано число', ()=>{
        let testPresenter = new Presenter(testOptions, testView, testModel);
        testPresenter.noNumericValues = true;
        testPresenter.getAbsoluteData(0.6)
        assert.equal(i, 1);      
      })
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
      
      assert.deepEqual(testPresenter.getScaleData(), correctAnsver);
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
      //sinon.spy(HTMLElement.prototype, '');
      let noNumericScale:{} = {'один': 0, 'два': 1, 'три': 1, 'четыре': 1, 'пять': 1, 'девять': 4, 'десять': 1, 'одиннадцать': 1};
      let testPresenter: Presenter = new Presenter(testOptions, testView, testModel);
      let correctAnsver: {} = {0: 'один', 0.1: 'два', 0.2: 'три', 0.3: 'четыре', 0.4: 'пять', 0.8: 'девять', 0.9: 'десять', 1: 'одиннадцать'};
      
      assert.deepEqual(testPresenter.getScaleData(noNumericScale), correctAnsver);
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

  describe('Проверка метода checkChangeScale():boolean, '+
    'проверяющего габариты слайдера на случай необходимости изменения конфигурации шкалы слайдера', function() {

    describe('Прохождение проверки при использовании нецифровой шкалы слайдера', ()=> {

      it('Проверка ', function() { 
        let fakeView: View;
        let fakeModel: Model;
        let testPresenter: Presenter;
        fakeView = sinon.createStubInstance(View);
        fakeModel = sinon.createStubInstance(Model);
        testPresenter = new Presenter({}, fakeView, fakeModel);  
        testPresenter.noNumericScale = {};

        assert.equal(testPresenter.checkChangeScale(), false);
      })
    })

    describe('Прохождение проверки при использовании цифровой шкалы слайдера ', ()=> {
      let testingData = [[6, 600, 65, true], [7, 460, 65, false], [8, 810, 100, false], [3, 400, 50, true]];
      testingData.forEach(function(value, index) {
        
        let fakeView;
        let fakeModel: Model;
        let testPresenter: Presenter;

        it('Проверка ' + index, function() { 
          fakeView = sinon.createStubInstance(View);
          fakeView.getSliderSize.returns(value[1]);
          fakeModel = sinon.createStubInstance(Model);
          testPresenter = new Presenter({}, fakeView, fakeModel);
          testPresenter.scalePointCount = value[0] as number;       
          testPresenter.scaleTick = value[2] as number;        
                
          assert.equal(testPresenter.checkChangeScale(), value[3] as boolean);
          
          sinon.restore();
        })
      })
    })
  })

  describe('Тестирование обработчиков событий (handlers)', ()=> {
    describe('Тестирование обработчика positionHandler(position: number, index?: number): void. '+
    'Данный обработчик осуществляет передачу данных о положении активного бегунка или о позиции текущего клика на треке слайдера. '+
    'Обработчик передается в слушатели объектов View', ()=> {
      let testPresenter = new Presenter({}, testView, testModel);
      testPresenter.currentRange=[];
      testPresenter.currentRange.push(100);
      testPresenter.currentRange.push(400);

      it('Переданы данные, не требующие изменения положения бегунков (н.р. курсор перемещен на расстояние, меньшее, чем шаг)',
      ()=> {
        sinon.stub(Model.prototype, 'possibleValueAnalysis').callsFake(()=> {return -1});        
        testPresenter.positionHandler(0.5, 1);
        assert.equal(testPresenter.currentRange[1], 400);
        sinon.restore();
      })

      it('Переданы данные, требующие изменения положения бегунков', ()=> {
        let i: number = 0;
        sinon.stub(Model.prototype, 'possibleValueAnalysis').callsFake(()=> {return 0.5});
        sinon.stub(Presenter.prototype, 'getAbsoluteData').callsFake(()=>{return 500});
        let spy = sinon.stub(View.prototype, 'setElementPositions').callsFake(()=>{i++});
        //let spy = sinon.spy(View.prototype.setElementPositions);
        
        testPresenter.positionHandler(0.5, 1);
        assert.equal(testPresenter.currentRange[1], 500);
        assert.equal(spy.callCount, 1, 'Шпион вызван не 1 раз');
        assert.deepEqual(spy.args[0], [0.5, 1, '500']);
        sinon.restore();
      })
    })

    describe('Тестирование обработчика resizeHandler(): void. Обработчик запускает обеспечивает отзывчивость слайдера, '+
    'реагируя на изменения габаритов окна web страницы (ширины). Происходит запуск изменения шкалы слайдера, '+
    '(остальные элементы не требуют специальных методов для отзывчивости). Обработчик передается в слушатель объекта window', ()=> {
      let testPresenter = new Presenter({}, testView, testModel);

      let rmScaleSpy: Sinon.SinonStub;
      let setScaleSpy: Sinon.SinonStub;
      let getScaleDataSpy: Sinon.SinonStub;
      let setSliderOrientationSpy: Sinon.SinonStub;
      let checkChangeScaleSpy: Sinon.SinonStub;

      before(()=> {  
        checkChangeScaleSpy = sinon.stub(Presenter.prototype, 'checkChangeScale')     
        rmScaleSpy = sinon.stub(View.prototype, 'removeScale');
        setScaleSpy = sinon.stub(View.prototype, 'setScale');
        getScaleDataSpy = sinon.stub(Presenter.prototype, 'getScaleData');
        setSliderOrientationSpy = sinon.stub(View.prototype, 'setSliderOrientation');  
      })

      afterEach(()=>{
        sinon.resetHistory()
      })
      after(()=> {
        sinon.restore();
      })

      it('Проверка. Изменение интерфейса в ответ на изменение габаритов окна не требуется', ()=> {
        checkChangeScaleSpy.callsFake(()=> {return false});
        testPresenter.resizeHandler();
        let result: number = rmScaleSpy.callCount + setScaleSpy.callCount + getScaleDataSpy.callCount + setSliderOrientationSpy.callCount;        
        assert.equal(result, 0);
      })

      it('Проверка. Вызов методов изменения шкалы слайдера', ()=>{
        checkChangeScaleSpy.callsFake(()=> {return true});
        testPresenter.resizeHandler();
        let result: number = rmScaleSpy.callCount + setScaleSpy.callCount + getScaleDataSpy.callCount + setSliderOrientationSpy.callCount;        
        assert.equal(result, 4);       
      })
    })

    describe('Тестирование обработчика externalDataHandler(value: string, index: number). '+
    'Обработчик реагирует на изменения в инпутах (ввод нового значения слайдера пользователем). '+
    'Последовательно вызывает методы, проверяющие возможность изменения значений слайдера и изменяющие текущие значения', ()=> {
      let testPresenter = new Presenter({}, testView, testModel);
      let getRelativeDataSpy: Sinon.SinonStub;
      let possibleValueAnalysisSpy: Sinon.SinonStub;
      let getAbsoluteDataSpy: Sinon.SinonStub;
      let setElementPositionsSpy: Sinon.SinonStub;
      let result: number;
      
      before(()=> {
        getRelativeDataSpy = sinon.stub(Presenter.prototype, 'getRelativeData');
        possibleValueAnalysisSpy= sinon.stub(Model.prototype,'possibleValueAnalysis');
        getAbsoluteDataSpy= sinon.stub(Presenter.prototype, 'getAbsoluteData').callsFake(()=> {return 500});
        setElementPositionsSpy= sinon.stub(View.prototype, 'setElementPositions');  
      })
      afterEach(()=> {
        sinon.resetHistory()
      })

      after(()=> {
        sinon.restore();
      })

      it('Проверка. Введенное значение не принимается (например, попытка установить отрицательный диапазон', ()=> {
        possibleValueAnalysisSpy.callsFake(()=> {return -1});
        
        testPresenter.externalDataHandler('50', 1);
        result = getRelativeDataSpy.callCount + getAbsoluteDataSpy.callCount + setElementPositionsSpy.callCount;
        assert.equal(result, 1);
      })

      it('Проверка. Введенное значение принимается', ()=> {
        possibleValueAnalysisSpy.callsFake(()=> {return 0.5});
        
        testPresenter.externalDataHandler('50', 1);
        result = getRelativeDataSpy.callCount + getAbsoluteDataSpy.callCount + setElementPositionsSpy.callCount;
        assert.equal(result, 3);
        assert.deepEqual(setElementPositionsSpy.args[0], [0.5, 1, '500']);
      })
    })

    describe('Тестирование обработчика controlDataHandler(value: number| boolean, hint: string). '+
    'Обработчик работает с командами, поступающими с контрольной панели', ()=> {
      let testPresenter = new Presenter({}, testView, testModel);

      let getRelativeDataSpy: Sinon.SinonStub;
      let setElementPositionsSpy: Sinon.SinonStub;
      let removeScaleSpy: Sinon.SinonStub;
      let setScaleSpy: Sinon.SinonStub;
      let getScaleDataSpy: Sinon.SinonStub;
      let setSliderOrientationSpy: Sinon.SinonStub;

      let result: number;
      
      describe(`Обработка команды на изменение минимального значения слайдера (hint == 'min-value')`, ()=> {
        before(()=>{
          getRelativeDataSpy = sinon.stub(Presenter.prototype, 'getRelativeData');
          setElementPositionsSpy = sinon.stub(View.prototype, 'setElementPositions');
          removeScaleSpy = sinon.stub(View.prototype, 'removeScale');
          setScaleSpy = sinon.stub(View.prototype, 'setScale');
          getScaleDataSpy = sinon.stub(Presenter.prototype, 'getScaleData');
          setSliderOrientationSpy = sinon.stub(View.prototype, 'setSliderOrientation');
        })

        beforeEach(()=> {
          testPresenter.minPossibleValue = 100;
          testPresenter.maxPossibleValue = 1000;
        })

        afterEach(()=>{
          result = 0;
          sinon.resetHistory();
        })

        after(()=> {
          sinon.restore();
        })

        it('Проверка при отсутствии шкалы слайдера', ()=> {
          testPresenter.view.sliderScale = undefined;
          testPresenter.controlDataHandler(300, 'min-value');
          result = getRelativeDataSpy.callCount + setElementPositionsSpy.callCount + removeScaleSpy.callCount + setScaleSpy.callCount 
            + getScaleDataSpy.callCount + setSliderOrientationSpy.callCount;
          assert.equal(testPresenter.minPossibleValue, 300);
          assert.equal(testPresenter.rangePossibleValues, 700);
          assert.equal(result, 2);
        })

        it('Проверка при отсутствии шкалы слайдера', ()=> {
          testPresenter.view.sliderScale = sinon.createStubInstance(SliderScale);
          testPresenter.controlDataHandler(350, 'min-value');
          result = getRelativeDataSpy.callCount + setElementPositionsSpy.callCount + removeScaleSpy.callCount + setScaleSpy.callCount 
            + getScaleDataSpy.callCount + setSliderOrientationSpy.callCount;
          assert.equal(testPresenter.minPossibleValue, 350);
          assert.equal(testPresenter.rangePossibleValues, 650);
          assert.equal(result, 6);
        })
      })

      describe(`Обработка команды на изменение максимального значения слайдера (hint == 'max-value')`, ()=> {
        before(()=>{
          getRelativeDataSpy = sinon.stub(Presenter.prototype, 'getRelativeData');
          setElementPositionsSpy = sinon.stub(View.prototype, 'setElementPositions');
          removeScaleSpy = sinon.stub(View.prototype, 'removeScale');
          setScaleSpy = sinon.stub(View.prototype, 'setScale');
          getScaleDataSpy = sinon.stub(Presenter.prototype, 'getScaleData');
          setSliderOrientationSpy = sinon.stub(View.prototype, 'setSliderOrientation');
        })

        beforeEach(()=> {
          testPresenter.minPossibleValue = 100;
          testPresenter.maxPossibleValue = 1000;
        })

        afterEach(()=>{
          result = 0;
          sinon.resetHistory();
        })

        after(()=> {
          sinon.restore();
        })

        it('Проверка при отсутствии шкалы слайдера', ()=> {
          testPresenter.view.sliderScale = undefined;
          testPresenter.controlDataHandler(1200, 'max-value');
          result = getRelativeDataSpy.callCount + setElementPositionsSpy.callCount + removeScaleSpy.callCount + setScaleSpy.callCount 
            + getScaleDataSpy.callCount + setSliderOrientationSpy.callCount;
          assert.equal(testPresenter.maxPossibleValue, 1200);
          assert.equal(testPresenter.rangePossibleValues, 1100);
          assert.equal(result, 2);
        })
        
        it('Проверка при отсутствии шкалы слайдера', ()=> {
          testPresenter.view.sliderScale = sinon.createStubInstance(SliderScale);
          testPresenter.controlDataHandler(1800, 'max-value');
          result = getRelativeDataSpy.callCount + setElementPositionsSpy.callCount + removeScaleSpy.callCount + setScaleSpy.callCount 
            + getScaleDataSpy.callCount + setSliderOrientationSpy.callCount;
          assert.equal(testPresenter.maxPossibleValue, 1800);
          assert.equal(testPresenter.rangePossibleValues, 1700);
          assert.equal(result, 6);
        })
      })

      describe(`Обработка команды на изменение шага слайдера (hint == 'step')`, ()=> {
        it('Установка шага 10', ()=> {
          testPresenter.rangePossibleValues = 900;
          let setStepSpy: Sinon.SinonStub = sinon.stub(Model.prototype, 'setStep');
          testPresenter.controlDataHandler(220, 'step');
          assert.equal(setStepSpy.callCount, 1);
          assert.equal(setStepSpy.args[0][0], 220/900);
          sinon.restore();
        })
      })

      describe(`Обработка команды добавление/удаление шкалы слайдера (hint == 'scale')`, ()=> {

        before(()=> {
          result = 0;
          removeScaleSpy = sinon.stub(View.prototype, 'removeScale'); //          
          setScaleSpy = sinon.stub(View.prototype, 'setScale').callsFake(()=>{ 
              testPresenter.view.sliderScale = sinon.createStubInstance(SliderScale)
          }); //
          getScaleDataSpy = sinon.stub(Presenter.prototype, 'getScaleData').callsFake(()=> {return {a: 10}}); //
          setSliderOrientationSpy = sinon.stub(View.prototype, 'setSliderOrientation'); //
        })

        afterEach(()=> {
          sinon.resetHistory();
          result = 0;
        })

        after(()=> {
          sinon.restore();
        })

        it('Пришла команда на удаление шкалы, при этом шкала отсуствует', ()=> {
          testPresenter.view.sliderScale = undefined;          
          testPresenter.controlDataHandler(false, 'scale');
          result = removeScaleSpy.callCount + setScaleSpy.callCount + getScaleDataSpy.callCount + setSliderOrientationSpy.callCount;
          assert.equal(result, 0);
        })

        it('Пришла команда на удаление шкалы, при этом шкала установлена', ()=> {
          testPresenter.view.sliderScale = sinon.createStubInstance(SliderScale);          
          testPresenter.controlDataHandler(false, 'scale');
          result = removeScaleSpy.callCount + setScaleSpy.callCount + getScaleDataSpy.callCount + setSliderOrientationSpy.callCount;
          assert.equal(result, 1);
        })

        it('Пришла команда на добавление шкалы, при этом шкала отсуствует', ()=> {
          testPresenter.view.sliderScale = undefined;
          testPresenter.view.verticalView = true;
          testPresenter.controlDataHandler(true, 'scale');
          result = removeScaleSpy.callCount + setScaleSpy.callCount + getScaleDataSpy.callCount + setSliderOrientationSpy.callCount;          
          
          assert.equal(result, 3);
          assert.deepEqual(setScaleSpy.args[0][0], {a: 10});
          assert.equal(setSliderOrientationSpy.args[0][0], true);
          assert.equal(setSliderOrientationSpy.args[0][1], testPresenter.view.sliderScale);
        })

        it('Пришла команда на добавление шкалы, при этом шкала установлена', ()=> {
          testPresenter.view.sliderScale = sinon.createStubInstance(SliderScale);          
          testPresenter.controlDataHandler(true, 'scale');
          result = removeScaleSpy.callCount + setScaleSpy.callCount + getScaleDataSpy.callCount + setSliderOrientationSpy.callCount;
          assert.equal(result, 0);
        })
      })

      describe(`Обработка команды на изменение ориентации слайдера (hint == 'vertical')`, ()=> {
        let checkChangeScaleSpy: Sinon.SinonStub;
        
        before(()=> {          
          getRelativeDataSpy = sinon.stub(Presenter.prototype, 'getRelativeData');
          setElementPositionsSpy = sinon.stub(View.prototype, 'setElementPositions');
          removeScaleSpy = sinon.stub(View.prototype, 'removeScale');
          setScaleSpy = sinon.stub(View.prototype, 'setScale');
          getScaleDataSpy = sinon.stub(Presenter.prototype, 'getScaleData');
          setSliderOrientationSpy = sinon.stub(View.prototype, 'setSliderOrientation');
          checkChangeScaleSpy = sinon.stub(Presenter.prototype, 'checkChangeScale').callsFake(()=> {return true});
        })

        beforeEach(()=> {
          result = 0;
          sinon.resetHistory();
        })

        after(()=> {
          sinon.restore();
        })

        it('Команда на установку вертикальной ориентации (при этом слайдер имеет вертикальную ориентацию)', ()=> {
          testPresenter.view.verticalView = true;

          testPresenter.controlDataHandler(true, 'vertical');

          assert.equal(result, 0);
        })

        it('Команда на установку вертикальной ориентации (при этом слайдер имеет горизонтальную ориентацию)', ()=> {
          testPresenter.view.verticalView = false;
          testPresenter.view.sliderScale = undefined;

          testPresenter.controlDataHandler(true, 'vertical');
          
          result = getRelativeDataSpy.callCount + setElementPositionsSpy.callCount + removeScaleSpy.callCount + setScaleSpy.callCount 
          + getScaleDataSpy.callCount + setSliderOrientationSpy.callCount + checkChangeScaleSpy.callCount;
          assert.equal(result, 3);
        })

        it('Команда на установку горизонтальную ориентации (при этом слайдер имеет вертикальную ориентацию), '+
        'в составе слайдера есть шкала', ()=> {
          testPresenter.view.verticalView = true;
          testPresenter.view.sliderScale = sinon.createStubInstance(SliderScale);

          testPresenter.controlDataHandler(false, 'vertical');

          result = getRelativeDataSpy.callCount + setElementPositionsSpy.callCount + removeScaleSpy.callCount + setScaleSpy.callCount 
          + getScaleDataSpy.callCount + setSliderOrientationSpy.callCount + checkChangeScaleSpy.callCount;
          assert.equal(result, 8);
        })
      })

      describe(`Обработка команды добавление/удаление подписей над бегунками (далее - фидбеки) (hint == 'feedback')`, ()=> {
        let testPresenter = new Presenter({}, testView, testModel);
        let setThumbFeedbacksSpy: Sinon.SinonStub;
        let removeThumbFeedbackSpy: Sinon.SinonStub;

        before(()=> {
          setThumbFeedbacksSpy  = sinon.stub(View.prototype, 'setThumbFeedbacks');
          removeThumbFeedbackSpy = sinon.stub(View.prototype, 'removeThumbFeedback');
        })

        afterEach(()=> {
          sinon.resetHistory()
        })
        after(()=> {
          sinon.restore()
        })

        it('Передана команда на удаление фидбеков, при этом фидбеки не установлены', ()=> {
          testPresenter.view.useFeedback = false;

          testPresenter.controlDataHandler(false, 'feedback');

          assert.equal(setThumbFeedbacksSpy.callCount, 0);
          assert.equal(removeThumbFeedbackSpy.callCount, 0);
        })

        it('Передана команда на удаление фидбеков, при этом фидбеки установлены', ()=> {
          testPresenter.view.useFeedback = true;

          testPresenter.controlDataHandler(false, 'feedback');

          assert.equal(setThumbFeedbacksSpy.callCount, 0);
          assert.equal(removeThumbFeedbackSpy.callCount, 1);
        })

        it('Передана команда на установку фидбеков, при этом фидбеки не установлены', ()=> {
          testPresenter.view.useFeedback = false;

          testPresenter.controlDataHandler(true, 'feedback');

          assert.equal(setThumbFeedbacksSpy.callCount, 1);
          assert.equal(removeThumbFeedbackSpy.callCount, 0);
        })

        it('Передана команда на установку фидбеков, при этом фидбеки установлены', ()=> {
          testPresenter.view.useFeedback = true;

          testPresenter.controlDataHandler(true, 'feedback');

          assert.equal(setThumbFeedbacksSpy.callCount, 0);
          assert.equal(removeThumbFeedbackSpy.callCount, 0);
        })
      }) 
      
      describe(`Обработка команды на установку режима выборадиапазона/одиночного значения hint == 'range-mode'`, ()=> {
        let testPresenter = new Presenter({}, testView, testModel);

        let setRangeModeSpy: Sinon.SinonStub;
        let setSingleModeSpy: Sinon.SinonStub;
        let setThumbFeedbacksSpy: Sinon.SinonStub;
        let result: number = 0;
        before(()=> {
          setRangeModeSpy = sinon.stub(View.prototype, 'setRangeMode');
          setSingleModeSpy = sinon.stub(View.prototype, 'setSingleMode');
          setSliderOrientationSpy = sinon.stub(View.prototype, 'setSliderOrientation');
          setElementPositionsSpy = sinon.stub(View.prototype, 'setElementPositions');
          setThumbFeedbacksSpy = sinon.stub(View.prototype, 'setThumbFeedbacks');
        })

        afterEach(()=> {
          sinon.resetHistory();
          result = 0;
        })

        after(()=> {
          sinon.restore();
        })

        it('Передана команда на установку режима выбора диапазона. Слайдер уже в режиме выбора диапазона', ()=> {
          testPresenter.view.useFeedback = false;
          testPresenter.view.rangeMode = true;

          testPresenter.controlDataHandler(true, 'range-mode');
          result = setElementPositionsSpy.callCount + setSliderOrientationSpy.callCount + setThumbFeedbacksSpy.callCount + setRangeModeSpy.callCount + 
            setSingleModeSpy.callCount;

          assert.equal(result, 0);
        })

        it('Передана команда на установку режима выбора диапазона. Слайдер в режиме выбора единичного значения', ()=> {
          testPresenter.view.useFeedback = false;
          testPresenter.view.rangeMode = false;

          testPresenter.controlDataHandler(true, 'range-mode');
          result = setElementPositionsSpy.callCount + setSliderOrientationSpy.callCount + setThumbFeedbacksSpy.callCount + setRangeModeSpy.callCount + 
            setSingleModeSpy.callCount;

          assert.equal(result, 4);
        })

        it('Передана команда на установку режима выбора диапазона. '+
        'Слайдер в режиме выбора единичного значения, с отображением значений над бегунками', ()=> {
          testPresenter.view.useFeedback = true;
          testPresenter.view.rangeMode = false;

          testPresenter.controlDataHandler(true, 'range-mode');
          result = setElementPositionsSpy.callCount + setSliderOrientationSpy.callCount + setThumbFeedbacksSpy.callCount + setRangeModeSpy.callCount + 
            setSingleModeSpy.callCount;

          assert.equal(result, 5);
        })

        it('Передана команда на установку режима единичного значения. Слайдер в режиме выбора диапазона', ()=> {
          testPresenter.view.useFeedback = false;
          testPresenter.view.rangeMode = true;

          testPresenter.controlDataHandler(false, 'range-mode');
          result = setElementPositionsSpy.callCount + setSliderOrientationSpy.callCount + setThumbFeedbacksSpy.callCount + setRangeModeSpy.callCount + 
            setSingleModeSpy.callCount;

          assert.equal(result, 1);
        })

        it('Передана команда на установку режима единичного значения. Слайдер уже в режиме единичного значения', ()=> {
          testPresenter.view.useFeedback = false;
          testPresenter.view.rangeMode = false;

          testPresenter.controlDataHandler(false, 'range-mode');
          result = setElementPositionsSpy.callCount + setSliderOrientationSpy.callCount + setThumbFeedbacksSpy.callCount + setRangeModeSpy.callCount + 
            setSingleModeSpy.callCount;

          assert.equal(result, 0);
        })
      })
    })


  })
})