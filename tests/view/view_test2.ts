/// <reference path="../../src/scripts/app.d.ts" />
import { Model } from '../../src/scripts/model';
import { expect, assert } from 'chai';
import * as sinon from 'sinon';
let chai = require('chai');
chai.use(require('sinon-chai'));
import { View, PageElement, Slider, SliderTrack, SliderThumb, SliderFiller, ThumbFeedback, SliderScale, ControlPanel } from '../../src/scripts/view';

import { JSDOM } from 'jsdom';
const { window } = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);

const { document } = (new JSDOM('<!DOCTYPE html><body><p>Hello world</p></body></html>')).window;

global.document = document;
global.window = document.defaultView;
global.HTMLElement = document.defaultView.HTMLElement;

let rootHTML: HTMLElement = document.createElement('div');
document.getElementsByTagName('body')[0].appendChild(rootHTML);
rootHTML.style.width = '400px';
rootHTML.style.height = '500px';

let firstExternalReciever: HTMLInputElement = document.createElement('input');
firstExternalReciever.id = 'er1';
let secondExternalReciever: HTMLInputElement = document.createElement('input');
secondExternalReciever.id = 'er2';
let externalRecievers: HTMLInputElement[] = [firstExternalReciever, secondExternalReciever];

describe('Тестирование методов класса и подклассов View', ()=> {
  
  describe('Тестирование методов класса PageElement (подкласс класса View, '+
  'на основе которого создаются классы, представляющие элементы слайдера', ()=>{
    describe('Метод createHTMLElement, создающий html-код для элемента слайдера (базовая версия, расширяемая/заменяемая в производных классах)', ()=> {
      it('Создание элемента с классом "Slider"', ()=> {
        let testElement = new PageElement('slider', 'slider', rootHTML);
        let testHTMLElement: HTMLElement = testElement.createHTMLElement('slider');
        let sampleHTMLElement: HTMLElement = document.createElement('div');
        sampleHTMLElement.className = 'slider';
        //expect(testHTMLElement).to.deep.equal(sampleHTMLElement);
        assert.deepEqual(testHTMLElement.outerHTML, sampleHTMLElement.outerHTML)
      })
    })

    describe('Тестирование метода changeOrientation, меняющего настройки элемента слайдера (базовая версия, расширяемая/заменяемая в производных класса) '+
    'в зависимости от ориентации слайдера (горизонтальная/вертикальная)', ()=>{
      it('Тестирование при горизонтальной ориентации слайдера (аргумент метода: false)', ()=> {
        let testElement = new Slider('slider', 'slider', rootHTML);
        testElement.changeOrientation(false);
      })

      it('Тестирование при вертикальной ориентации слайдера (аргумент метода: true)', ()=> {
        let testElement = new Slider('slider', 'slider', rootHTML);
        testElement.changeOrientation(true);      
      })
    })

    describe('Тестирование метода removeHTMLElement(): void, удаляющего HTML объект элемента слайдера', ()=> {
      afterEach(()=> {        
        sinon.restore();
      })
      it('Тест 1', ()=> {
        let testPageElement = new PageElement('element', 'element', rootHTML);
        let spy = sinon.spy();
        sinon.stub(HTMLElement.prototype, 'remove').callsFake(spy);
        testPageElement.removeHTMLElement();
        assert.equal(spy.callCount, 1);
        
      })
    })
  })


  describe('Тестирование методов класса Slider (расширенный класс PageElement)', ()=> {
    describe('Тестирование метода changeOrientation (замена одноименного метода в родительском классе), меняющего настройки слайдера '+
    'в зависимости от заданной ориентации',()=> {

      let testArguments: {} = {'0': ['горизонтальный', 'horizontal'],  '1': ['вертикальный', 'vertical']};
      
      for (let key in testArguments)  {
        it(`Тестирование при ${testArguments[key][0]} ориентации слайдера (аргумент метода: ${!!parseInt(key)})`, ()=>{          
          let testElement = new Slider('slider', 'slider_test-Slider', rootHTML);
          testElement.changeOrientation(!!parseInt(key));
          let testHTMLElement = testElement.htmlObject;
          
          rootHTML.removeChild(document.getElementsByClassName('slider_test-Slider')[0])
          
          let sampleHTMLElement: HTMLElement = document.createElement('div');
          sampleHTMLElement.className = 'slider_test-Slider slider_test-Slider_' + testArguments[key][1];
          
          assert.deepEqual(testHTMLElement.outerHTML, sampleHTMLElement.outerHTML);          
        })
      }
    })
  })

  describe('Тестирование методов класса SliderTrack (расширенный класс PageElement), представляющего трек слайдера', ()=> {
    describe('Тестирование метода setListeners, устанавливающего слушатели на события слайдера '+
    '(перемещение курсора, уход курсора с трека, нажатие на кнопку мыши, отпускание кнопки мыши', ()=> {
      let testTrack = new SliderTrack('track', 'track', rootHTML);
      let eventHandler: Function;
      let setThumb: Function;
      testTrack.setListeners(eventHandler, setThumb);
      let testHTMLElement: HTMLElement = testTrack.htmlObject;
      
      it('Проверка установки слушателя на событие onmousemove', ()=> {        
        assert.isFunction(testHTMLElement.onmousemove);
      })

      it('Проверка установки слушателя на событие onmouseleave', ()=> {        
        assert.isFunction(testHTMLElement.onmouseleave);
      })

      it('Проверка установки слушателя на событие onmouseup', ()=> {        
        assert.isFunction(testHTMLElement.onmouseup);
      })

      it('Проверка установки слушателя на событие onmousedown', ()=> {        
        assert.isFunction(testHTMLElement.onmousedown);
      })
    })
  })

  describe('Тестирование методов класса ThumbFeedback (расширенный класс PageElement), представляющего элемент с текстом над бегунком (далее - фидбек)', ()=> {
    describe('Тестирование метода setValue, устанавливающего TextContent для фидбека', ()=> {
      it('Тестирование метода', ()=> {
        let testFeedback = new ThumbFeedback('feedback', 'feedback', rootHTML);
        let argument: string = 'sample';
        testFeedback.setValue(argument);

        assert.equal(testFeedback.htmlObject.textContent, argument);
      })
    })
  })

  describe('Тестирование методов класса SliderThumb, представляющего бегунки слайдера', ()=>{

    describe('Тестирование метода changeOrientation, передающего настройки текущей ориентации слайдера объекту бегунка', ()=> {
      let testThumb = new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return});

      it('Проверка состояния переключателя вертикального вида при вертикальной ориентации', ()=>{
        testThumb.changeOrientation(false);
        assert.isNotTrue(testThumb.verticalView);
      })

      it('Проверка состояния переключателя вертикального вида при горизонтальной ориентации', ()=>{
        testThumb.changeOrientation(true);
        assert.isTrue(testThumb.verticalView);
      })

      it('Проверка сброса атрибута style html-элемента бегунка при изменении настроек ориентации бегунка', ()=>{
        testThumb.htmlObject.style.left = '11%';        
        testThumb.changeOrientation(true);       
        assert.equal(testThumb.htmlObject.style.length, 0);
      })
    })

    describe('Тестирование метода setListeners, устанавливающего слушатели на события бегунка', ()=>{
      let testThumb: SliderThumb = new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return});
      let thumbHTMLElement: HTMLElement = testThumb.htmlObject;
      let eventHandler: Function;
      testThumb.setListeners(eventHandler);
      it('Проверка установки слушателя на событие onmousedown', ()=>{
        assert.isFunction(thumbHTMLElement.onmousedown)
      })

      it('Проверка установки слушателя на событие onmouseup', ()=>{
        assert.isFunction(thumbHTMLElement.onmouseup)
      })
    })

    describe('Тестирование метода manageFeedback, управляющего (добавление/удаление) надписью над бегунком (далее - фидбек)', ()=>{    
      
      describe('Режим использования фидбека', ()=> {
        let testThumb: SliderThumb = new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return});
        it('Проверка свойств объекта бегунка', ()=> {
          testThumb.manageFeedback(true);
          assert.instanceOf(testThumb.feedback, ThumbFeedback);
        })
      })
      describe('Режим работы без фидбека', ()=>{
        let testThumb: SliderThumb = new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return});
        let feedbackClassName: string = 'thumb__feedback';
        let testFeedback = new ThumbFeedback('feedback', feedbackClassName, testThumb.htmlObject);
        testThumb.feedback = testFeedback;
        testThumb.manageFeedback(false);

        it('Проверка свойств объкета бегунка', ()=> {
          assert.isUndefined(testThumb.feedback);
        })

        it('Проверка свойств html-элемента бегунка (html-элемент фидбека должен быть удален из DOM)', ()=>{          
          assert.isEmpty(testThumb.htmlObject.getElementsByClassName(feedbackClassName));
        })
      })
    })

    describe('Тестирование метода move, перемещающего бегунок на заданную позицию (проверка корректности позиции выполняется в Model', ()=>{
      let position: number = 0.5;
      
      it('Перемещение бегунка при горизонтальной ориентации слайдера в позицию 50% от левого края родительского html-элемента', ()=> {
        let testThumb: SliderThumb = new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return});
        testThumb.verticalView = false;
        testThumb.move(position);
        assert.equal(testThumb.htmlObject.style.left, '50%');
      })

      it('Перемещение бегунка при вертикальной ориентации слайдера в позицию 50% от верхнего края родительского html-элемента', ()=> {
        let testThumb: SliderThumb = new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return});
        testThumb.verticalView = true;
        testThumb.move(position);
        assert.equal(testThumb.htmlObject.style.top, '50%');
      })
    })

    describe('Тестирование метода setPositionAttribute(value?: number), '+
      'записывающего в атрибут dataset-position координату (текущую или потенциальную) бегунка', ()=> {
        let localRootHTML: HTMLElement = document.createElement('div');
        rootHTML.appendChild(localRootHTML);
        localRootHTML.style.width = '500px';
        localRootHTML.style.height = '500px';
        localRootHTML.style.position = 'relative';
        let testThumb: SliderThumb = new SliderThumb('thumb', 'thumb', localRootHTML, ()=>{return});
        testThumb.htmlObject.style.position = 'absolute';

        it('Вызов метода с аргументом, в атрибут dataset-position записывается значение аргумента', ()=> {
          testThumb.setPositionAttribute(0.5);
          assert.equal(testThumb.htmlObject.dataset.position, '0.5');
        })

        it('Вызов метода без аргумента, в атрибут dataset-position записывается текущая координата бегунка, ', ()=> {
          testThumb.htmlObject.style.left = '60%';
          testThumb.verticalView = false;
          testThumb.setPositionAttribute();
          assert.equal(testThumb.htmlObject.dataset.position, '0.6');
        })
      })

    describe('Тестирование преобразования объекта бегунка к примитивному значению (метод [Symbol.toPrimitive])',()=> {
      let testThumb: SliderThumb = new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return});
      
      it('Преобразование при математических операциях с объектом бегунка (атрибута dataset-position не задан)', ()=> {
        assert.equal(+testThumb, -1);
      })

      it('Преобразование при математических операциях с объектом бегунка (задан атрибут dataset-position), '+
        'метод возвращает значение атрибута dataset-position', ()=> {        
        testThumb.htmlObject.dataset.position = '0.5';
             
        assert.equal(+testThumb, 0.5);
      })
    

      it('Преобразование при строковых операциях с объектом бегунка (возвращается имя объекта)', ()=> {
        assert.equal('' + testThumb, 'thumb');
      })
    })
  })

  describe('Тестирование методов класса SliderFiller, '+
    'представляющего заполнитель между бегунками при работе слайдера в режиме выбора диапазона', ()=> {
      describe('Тестирование метода move(position[]: number), изменяющего габариты и координаты заполнителя в зависимости от координат бегунков', ()=> {
        
        describe('Проверка метода при горизонтальной ориентации слайдера', ()=> {
          let testFiller = new SliderFiller('filler', 'filler', rootHTML);
          testFiller.verticalView = false;
          testFiller.move([0.2, 0.5]);

          it('Проверка координаты заполнителя (расстояние от левого края родителя)', ()=> {
            assert.equal(testFiller.htmlObject.style.left, '20%');
          })

          it('Проверка габарита заполнителя (ширина)', ()=> {
            assert.equal(testFiller.htmlObject.style.width, '30%');
          })
        })

        describe('Проверка метода при вертикальной ориентации слайдера', ()=> {
          let testFiller = new SliderFiller('filler', 'filler', rootHTML);
          testFiller.verticalView = true;
          testFiller.move([0.2, 0.5]);

          it('Проверка координаты заполнителя (расстояние от верхнего края родителя)', ()=> {
            assert.equal(testFiller.htmlObject.style.top, '20%');
          })

          it('Проверка габарита заполнителя (высоты)', ()=> {
            assert.equal(testFiller.htmlObject.style.height, '30%');
          })
        })

        describe('Проверка на отработку некорректных аргументов метода', ()=> {
          /////////////////////////////
        })
      })

      describe('Проверка метода changeOrientation (verticalView: boolean), '+
      'изменяющего конфигурацию заполнителя в зависимости от ориентации слайдера. Метод расширяет одноименный метод из родительского класса', ()=> {
        let testFiller: SliderFiller = new SliderFiller('filler', 'filler', rootHTML);
        it('Проверка при горизонтальной ориентации слайдера', ()=> {
          testFiller.htmlObject.style.top = '40%';
          testFiller.htmlObject.style.height = '40%';
          testFiller.changeOrientation(false);   
          assert.equal(testFiller.htmlObject.style.length, 0);
        })

        it('Проверка при вертикальной ориентации слайдера', ()=> {
          testFiller.htmlObject.style.top = '40%';
          testFiller.htmlObject.style.height = '40%';
          testFiller.changeOrientation(true);        
          assert.equal(testFiller.htmlObject.style.length, 0);
        })
      })
    })

  describe('Тестирование методов класса SliderScale (подкласс класса View, представляющий шкалу слайдера)', ()=> {
    
    //let scaleData: {} = {0.1: '1', 0.2: '2', 0.3: '3', 0.4: '4', 0.5: '5', 0.6: '6', 0.7: '7', 0.8: '8', 0.9: '9', 1: '10'};
    let scaleData: {} = {0: '1', 1: '2'};
    let testScale: SliderScale = new SliderScale('scale', 'slider__scale', rootHTML, scaleData);
    
    
    describe('Тестирование метода createScaleHTMLComponent, генерирующего компонент html элемента шкалы слайдера, '+
    'состоящего из двух узлов (отметка шкалы и текст), обернутых в div. '+
    'Генерация проводится на основе координаты компонента (в долях от единицы) и текстового описания, '+
    'перечень которых создается методами Presenter:', () => {
      it('Генерация узла шкалы с координатами 0.1 и значением "1"', ()=> {
        let sampleNode: HTMLElement = document.createElement('div');
        sampleNode.className = 'scale__component';
        sampleNode.dataset.position = '0.1';
        let HTMLCode: string = '<div class="scale__mark"></div><div class="scale__mark-label">1</div>'
        sampleNode.innerHTML = HTMLCode;

        let scaleNode: HTMLElement = testScale.createScaleHTMLComponent('0.1', '1');

        assert.deepEqual(scaleNode.outerHTML, sampleNode.outerHTML);
      })      
    })

    describe('Тестирование метода changeOrientation, изменяющего конфигурацию шкалы '+
      'в зависимости от ориентации слайдера (горизонтальная/вертикальная) '+
      'путем изменения точки позиционирования элементов шкалы (left/top)', ()=>{
      rootHTML.removeChild(rootHTML.getElementsByClassName('slider__scale')[0]) //элемент удаляется из DOM для возможности сравнить этот элемент с эталонным
      
      let testElement: HTMLElement;
      let keyArray: number[] = Object.keys(scaleData).map((key)=>{return parseFloat(key)});
      
      keyArray.sort((a, b)=>{ return a- b });

      it('Тестирование при вертикальной ориентации слайдера (аргумент метода: false)', ()=> {
        let sampleElement: HTMLElement = document.createElement('div');
        let HTMLCode: string = '';
        sampleElement.className = 'slider__scale slider__scale_vertical';
        keyArray.forEach((key)=> {
          HTMLCode += `<div class="scale__component" data-position="${key}" style="top: ${key * 100 + '%'};">`+
          `<div class="scale__mark"></div>`+
          `<div class="scale__mark-label">${scaleData[key]}</div></div>`;
        });
        sampleElement.innerHTML = HTMLCode;
        

        testScale.changeOrientation(true);
        testElement = testScale.htmlObject;
        assert.deepEqual(testElement.outerHTML, sampleElement.outerHTML);
      })

      it('Тестирование при горизонтальной ориентации слайдера (аргумент метода: true)', ()=> {
        let sampleElement: HTMLElement = document.createElement('div');
        sampleElement.className = 'slider__scale slider__scale_horizontal';
        let HTMLCode: string = '';
        keyArray.forEach((key)=> {
          HTMLCode += `<div class="scale__component" data-position="${key}" style="left: ${key * 100 + '%'};">`+
          `<div class="scale__mark"></div>`+
          `<div class="scale__mark-label">${scaleData[key]}</div></div>`;
        }); 
        sampleElement.innerHTML = HTMLCode;

        testScale.changeOrientation(false);
        testElement = testScale.htmlObject;
        
        
        assert.deepEqual(testElement.outerHTML, sampleElement.outerHTML);
      })
    })
  })
  
  describe('Тестирование методов класса View', ()=> {
    let testView: View = new View();
   describe('Тестирование метода setBaseConfiguration, устанавливающего базовую конфигурацию слайдера '+
   '(объекты слайдера, трека слайдера и одного бегунка):', ()=> {
    testView.setBaseConfiguration(rootHTML);
    it('Свойство slider объекта View получает ссылку на экземпляр класса Slider;', ()=> {
      assert.instanceOf(testView.slider, Slider);
    })

    it('Свойство sliderTrack объекта View получает ссылку на экземпляр класса SliderTrack;', ()=> {
      assert.instanceOf(testView.sliderTrack, SliderTrack);
    })

    it('Первый элемент массива sliderThumbs объекта View получает ссылку на экземпляр класса SliderThumb;', ()=> {
      assert.instanceOf(testView.sliderThumbs[0], SliderThumb);
    })    
   })

   describe('Тестирование метода setRangeMode, переводящего слайдер в режим выбора диапазона значений '+
   '(добавляется второй бегунок и заполнитель между бегунками):', ()=> {
      testView.setRangeMode();
      it('Установка свойства rangeMode объекта View равное true ', ()=> {
        assert.isTrue(testView.rangeMode);
      })

      it('Второй элемент массива sliderThumbs объекта View получает ссылку на экземпляр класса SliderThumb;', ()=> {
        assert.instanceOf(testView.sliderThumbs[1], SliderThumb);
      })

      it('Свойство sliderFiller объекта View получает ссылку на экземпляр класса SliderFiller;', ()=> {
        assert.instanceOf(testView.sliderFiller, SliderFiller);
      })
    })

    describe('Тестирование метода setSingleMode(): void, переводящего слайдер в режим выбора единичного значения. '+
    'Метод удаляет лишние элементы слайдера', ()=> {
      it('Тест 1', ()=> {
        let testView: View = new View();
        testView.rangeMode = true;
        let testThumb1: SliderThumb = sinon.createStubInstance(SliderThumb);
        testView.sliderThumbs.push(testThumb1);
        let testThumb2: SliderThumb  = sinon.createStubInstance(SliderThumb);
        testView.sliderThumbs.push(testThumb2);
        let testFiller: SliderFiller = sinon.createStubInstance(SliderFiller);
        testView.sliderFiller = testFiller;
        testView.setSingleMode();
        assert.isFalse(testView.rangeMode);
        assert.equal(testView.sliderThumbs.length, 1);
        assert.isUndefined(testView.sliderFiller);
      })
    })

    describe('Тестирование метода setThumbFeedbacks, добавляющего отображение текущих значений над бегунками (далее - фидбеки). '+
    'Метод вызывает соответствующий метод класса SliderThumb для каждого экземпляра класса SliderThumb', ()=> {
      let thumbsCountCollection: number[] = [1, 2, 6];
      let testView = new View();
      let spy = sinon.spy();

      thumbsCountCollection.forEach(function(thumbsCount) {        
        it('Проверка работы метода при количестве экземпляров класса SliderThumb равное ' + thumbsCount, ()=> {
          let normalManageFeedback = SliderThumb.prototype.manageFeedback;
          SliderThumb.prototype.manageFeedback = spy;
          testView.sliderThumbs.length = 0;
          spy.resetHistory();
          
          for (let i = 0; i < thumbsCount; i++) {
            testView.sliderThumbs.push(new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return}))
          }

          testView.setThumbFeedbacks();

          expect(spy).to.have.callCount(thumbsCount);   
          SliderThumb.prototype.manageFeedback = normalManageFeedback;         
        })            
      }) 
    })

    describe('Тестирование метода setScale (создание и подключение шкалы слайдера)', ()=> {
      it('Проверка на передачу экземпляру класса View ссылки на экземпляр класса SliderScale', ()=> {

        let testView: View = new View();
        testView.slider = new Slider('slider', 'slider', rootHTML);
        let scaleData: {} = {};
        
        testView.setScale(scaleData);

        assert.instanceOf(testView.sliderScale, SliderScale)
      })
    })

    describe('Тестирование метода removeScale(): void, удаляющего шкалу из слайдера', ()=> {
      afterEach(()=> {
        sinon.restore();
      })

      it('Проверка 1', ()=> {
        let testView = new View();        
        let sliderHTMLObject: HTMLElement = document.createElement('div');

        let spy = sinon.spy();
        testView.sliderScale = new SliderScale('scale', 'scale', rootHTML, {});
        sinon.stub(SliderScale.prototype, 'removeHTMLElement').callsFake(spy);
        testView.sliderScale.htmlObject = sliderHTMLObject;
        
        testView.removeScale();
        assert.isUndefined(testView.sliderScale);
        assert.equal(spy.callCount, 1);
      })
    })

    describe('Проверка свойства setSliderOrientation(verticalView?: boolean, sliderElement?: PageElement ): void, '+
      'устанавливающего ориентацию для слайдера и его дочерних элементов', ()=> {
      it('Провека при конфигурации слайдера: выбор диапазона + отображение шкалы + без фидбеков', ()=> {
        let testView: View = new View();
        testView.slider = new Slider('slider', 'slider', rootHTML);
        testView.sliderTrack = new SliderTrack('track', 'slider', rootHTML);
        testView.sliderScale = new SliderScale('scale', 'slider', rootHTML, {});
        testView.sliderFiller = new SliderFiller('filler', 'slider', rootHTML);
        testView.sliderThumbs.push(new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return}));
        testView.sliderThumbs.push(new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return}));
             
        let spy = sinon.spy();
        let normalChangeOrientation = PageElement.prototype.changeOrientation;
        PageElement.prototype.changeOrientation = spy;

        testView.setSliderOrientation(true);
        
        assert.equal(spy.callCount, 6);
        
        PageElement.prototype.changeOrientation = normalChangeOrientation;
      })
      
      it('Провека при конфигурации слайдера: выбор единичного значения + без шкалы + с фидбеком', ()=> {
        let testView: View = new View();
        testView.slider = new Slider('slider', 'slider', rootHTML);
        testView.sliderTrack = new SliderTrack('track', 'slider', rootHTML);
        testView.sliderScale = new SliderScale('scale', 'slider', rootHTML, {});
        testView.sliderThumbs.push(new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return}));
        testView.sliderThumbs[0].feedback = new ThumbFeedback('feedback', 'feedback', rootHTML);

        let spy = sinon.spy();
        let normalChangeOrientation = PageElement.prototype.changeOrientation;
        PageElement.prototype.changeOrientation = spy;

        testView.setSliderOrientation(true);
        
        assert.equal(spy.callCount, 5);
        PageElement.prototype.changeOrientation = normalChangeOrientation;
      })

      it('Проверка при указании аргумента sliderElement. В данном случае меняется ориентация только указанного элемента', ()=> {
        let testView: View = new View();
        testView.sliderScale = new SliderScale('scale', 'scale', rootHTML, {});
        let stub = sinon.stub(SliderScale.prototype, 'changeOrientation');
        testView.setSliderOrientation(true, testView.sliderScale);        
        
        assert.equal(stub.callCount, 1);
        
        stub.restore();
      })

      it('Проверка при вызове метода с аргументом verticalView = undefined', ()=> {
        let testView: View = new View();
        testView.sliderScale = new SliderScale('scale', 'scale', rootHTML, {});
        let stub = sinon.stub(SliderScale.prototype, 'changeOrientation');
        testView.verticalView = true;
        testView.setSliderOrientation(undefined, testView.sliderScale);        
        
        assert.equal(stub.callCount, 1);
        assert.equal(stub.args[0][0], true);

        stub.restore();        
      })

    })

    describe('Тестирование метода setElementPositions(positions: number[]|number, index?: number), '+
    'устанавливающего позиции у дочерних элементов слайдера (бегунки и заполнитель)', ()=> {
      it('Тестирование метода при работе слайдера в режиме выбора единичного значения (управление одним бегунком)', ()=> {
        let testView: View = new View();
        testView.sliderThumbs.push(new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return}));
        
        let spy = sinon.spy();
        let normalMove = SliderThumb.prototype.move;
        SliderThumb.prototype.move = spy;

        let positions: number[] = [0.5];
        testView.setElementPositions(positions);
        assert.equal(spy.callCount, 1);

        SliderThumb.prototype.move = normalMove;        
      })

      it('Тестирование метода при работе слайдера в режиме выбора диапазона (управление двумя бегунками и заполнителем), '+
      'позиция задается массивом значений (позиция левого и правого бегунка)', ()=> {
        let testView: View = new View();
        testView.sliderThumbs.push(new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return}));
        testView.sliderThumbs.push(new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return}));
        testView.sliderFiller = new SliderFiller('filler', 'filler', rootHTML);
        
        let spy = sinon.spy();
        let normalThumbMove = SliderThumb.prototype.move;
        SliderThumb.prototype.move = spy;
        let normalFillerMove = SliderFiller.prototype.move;
        SliderFiller.prototype.move = spy;

        let positions: number[] = [0.5, 0.8];
        testView.setElementPositions(positions);
        assert.equal(spy.callCount, 3);

        SliderThumb.prototype.move = normalThumbMove;
        SliderFiller.prototype.move = normalFillerMove;
      })

      it('Тестирование метода при работе слайдера в режиме выбора диапазона (управление двумя бегунками и заполнителем), '+
      'задается позиция конкретного бегунка (позиция на треке и номер бегунка в массиве sliderThumbs)', ()=> {
        let testView: View = new View();
        testView.verticalView = false;
        testView.sliderThumbs.push(new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return}));        
        testView.sliderThumbs.push(new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return}));
        testView.sliderFiller = new SliderFiller('filler', 'filler', rootHTML);
        
        let spy = sinon.spy();
        let normalThumbMove = SliderThumb.prototype.move;
        SliderThumb.prototype.move = spy;
        let normalFillerMove = SliderFiller.prototype.move;
        SliderFiller.prototype.move = spy;

        let i: number = 2;
        let stub = sinon.stub(SliderThumb.prototype, 'getPositionAttribute').callsFake(()=> {
          i++;
          return i;
        });

        let position: number = 0.8;
        testView.setElementPositions(position, 1);
        
        assert.deepEqual(spy.thisValues[0], testView.sliderThumbs[1]);
        assert.equal(spy.args[0][0], '0.8');
        assert.deepEqual(spy.args[1][0], [3, 4]);

        SliderThumb.prototype.move = normalThumbMove;
        SliderFiller.prototype.move = normalFillerMove;
        stub.restore();
      })
    })
    
    describe('Тестирование метода setListeners, устанавливающего слушатели на события дочерних элементов View', ()=> {
      after(()=> {
        sinon.restore();
      })
      it('Проверка передачи свойству externalHandler экземпляра класса View ссылки на внешний обработчик данных (из Presenter)', ()=> {
        let testView = new View();
        let positionHandler: Function = ()=>{return}; //простейшая функция нужна для работы assert
        let resizeHandler: Function = ()=>{return};
        testView.setListeners(positionHandler, resizeHandler);

        assert.isFunction(testView.externalPositionHandler);
      })

      it('Проверка количества вызовов методов дочерних элементов', ()=> {
        let testView = new View();
        let postionHandler: Function;
        let resizeHandler: Function = ()=>{return};
        testView.sliderTrack = new SliderTrack('track', 'track', rootHTML);
        testView.sliderThumbs.push(new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return}));
        testView.sliderThumbs.push(new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return}));
        testView.sliderScale = new SliderScale('scale', 'scale', rootHTML, {});       

        let i: number = 0;
        sinon.stub(SliderTrack.prototype, 'setListeners').callsFake(()=> {i++});
        sinon.stub(SliderThumb.prototype, 'setListeners').callsFake(()=> {i++});
        sinon.stub(SliderScale.prototype, 'setListeners').callsFake(()=> {i++});
        
        testView.setListeners(postionHandler, resizeHandler);
        
        assert.equal(i, 2);        
      })
    })

    describe('Тестирование метода setElementListener(element: PageElement | HTMLElement, handler: Function, event: string): void, '+
    'устанавливающего слушатель на элемент слайдера или элемент веб-страницы', ()=> {
      let testView: View = new View();
      let testHandler: Function = ()=> {return};
      
      it('Проверка установки слушателя на элемент слайдера', ()=> {
        let testSliderElement: PageElement = new PageElement('name', 'name', rootHTML);        
        testView.setElementListener(testSliderElement, testHandler, 'onclick');
        assert.isFunction(testSliderElement.htmlObject.onclick);
      })

      it('Проверка установки слушателя на элемент веб-страницы', ()=> {
        let testHTMLElement: HTMLElement = document.createElement('div');
        testView.setElementListener(testHTMLElement, testHandler, 'onclick');
        assert.isFunction(testHTMLElement.onclick);
      })
    })

    describe('Тестирование метода positionHandler. Метод обрабатывает данные о событиях мыши на элементе '+
    '(относительные координаты курсора - в долях от единицы, и тип события).', ()=> {      

      it('Обработка события перемещения курсора мыши на позицию "0.3" (событие mousemove), '+
        'слайдер работает в режиме выбора единичного значения', ()=> {
        let testView = new View();
        let spy = sinon.spy();
        testView.externalPositionHandler = spy;
        testView.sliderThumbs.push(new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return}));
        testView.sliderThumbs[0].htmlObject.dataset.position = '0.1';
        testView.activeThumb = testView.sliderThumbs[0];
        testView.positionHandler(0.3, 'mousemove');
        expect(spy.args[0][0]).to.deep.equal(0.3);
        expect(spy.args[0][1]).to.deep.equal(0);             
      })

      it('Обработка события перемещения курсора мыши на позицию "0.6" (событие mousemove), '+
      'слайдер работает в режиме выбора диапазона', ()=> {
        let testView = new View();
        let spy = sinon.spy();
        testView.externalPositionHandler = spy;
        testView.sliderThumbs.push(new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return}));
        testView.sliderThumbs[0].htmlObject.dataset.position = '0.1';
        testView.sliderThumbs.push(new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return}));
        testView.sliderThumbs[1].htmlObject.dataset.position = '0.4';
        testView.activeThumb = testView.sliderThumbs[1];
        testView.positionHandler(0.6, 'mousemove');
        expect(spy.args[0][0]).to.deep.equal(0.6);
        expect(spy.args[0][1]).to.deep.equal(1);        
      })

      it('Обработка события опускания кнопки мыши над элементом на позиции "0.2" (событие mousedown)', ()=> {
        let testView = new View();
        let spy = sinon.spy();
        testView.externalPositionHandler = spy;
        testView.positionHandler(0.2, 'mousedown');
        expect(spy.args[0][0]).to.deep.equal(0.2);
        assert.equal(spy.args[0].length, 1);       
      })
    })

    describe('Тестирование метода setActiveThumb. '+
    'Метод передает свойству activeThumb экземпляра класса View ссылку на экземпляр класса SliderThumb, '+
    'над которым произошло событие мыши (как правило, "mousedown")', ()=> {
      it('Проверка работоспособности метода', ()=>{
        let testView: View = new View();
        let testThumb: SliderThumb  = sinon.createStubInstance(SliderThumb) //new SliderThumb('thumb', 'thumb', rootHTML, ()=>{return});
        testView.setActiveThumb(testThumb);
        assert.equal(testView.activeThumb, testThumb);
      })
    })

    describe('Тестирование метода getSliderSize(verical?: boolean): number, '+
    'возвращающего габарит слайдера (ширину при горизонтальном виде слайдера или при передаче методу аргумента vertical = true, '+
    'высоту - при вертикальном виде слайдера или при передаче методу аргумента vertical = false)',()=> {
      let testView = new View();
      let sliderHTMLObject = document.createElement('div');
      testView.sliderTrack = sinon.createStubInstance(SliderTrack);
      rootHTML.appendChild(sliderHTMLObject);
      testView.sliderTrack.htmlObject = sliderHTMLObject;
      let indexTestData: number;
      let testData: {}[] = [
        {descriptor: 'Тестирование при горизонтальном виде слайдера', vertical: false, arg: undefined, width: 500, height: 30, ansv: 500},
        {descriptor: 'Тестирование при вертикальном виде слайдера', vertical: true, arg: undefined, width: 30, height: 750, ansv: 750},
        {descriptor:'Тестирование при передаче методу аргумента vertical = true', vertical: false, arg: true, width: 30, height: 420, ansv: 420},
        {descriptor: 'Тестирование при передаче методу аргумента vertical = false', vertical: false, arg: false, width: 635, height: 30, ansv: 635}]

      testData.forEach((data, index)=>{

        it(data['descriptor'], ()=> {
          sinon.stub(HTMLElement.prototype, 'clientWidth').value(data['width']);
          sinon.stub(HTMLElement.prototype, 'clientHeight').value(data['height']);
          testView.verticalView = data['vertical'];
          assert.equal(testView.getSliderSize(data['arg']), data['ansv']);  
          sinon.restore()
        })
      })

    })
  })
  
  describe('Тестирование контрольной панели', ()=> {
    let testPanelHTML: HTMLFormElement = document.createElement('form');
    testPanelHTML.name = 'control-panel';
    rootHTML.appendChild(testPanelHTML);
    
    let testInputText1: HTMLInputElement = document.createElement('input');
    testInputText1.name = 'min-value';
    testPanelHTML.appendChild(testInputText1);
    
    let testInputText2: HTMLInputElement = document.createElement('input');
    testInputText2.name = 'max-value';
    testPanelHTML.appendChild(testInputText2);
    
    let testInputCheck1: HTMLInputElement = document.createElement('input');
    testInputCheck1.name = 'cb1';
    testInputCheck1.type = 'checkbox';
    testPanelHTML.appendChild(testInputCheck1);
    
    let testInputCheck2: HTMLInputElement = document.createElement('input');
    testInputCheck2.name = 'cb2';
    testInputCheck2.type = 'checkbox';
    testPanelHTML.appendChild(testInputCheck2);

    describe('Тестирование метода setParameters(value: {})', ()=> {
      it('Тест 1', ()=> {
        let value: {} = {'min-value': 100, 'max-value': 300, 'cb1': true, 'cb2': false};
        let testPanel: ControlPanel = new ControlPanel(rootHTML);
        testPanel.setParameters(value);

        assert.equal(testInputText1.value, '100');
        assert.equal(testInputText2.value, '300');
        assert.equal(testInputCheck1.checked, true);
        assert.equal(testInputCheck2.checked, false);
      })
    })
  })
})
 

