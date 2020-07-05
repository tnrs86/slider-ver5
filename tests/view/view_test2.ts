/// <reference path="../../src/scripts/app.d.ts" />
//import { Model } from '../../src/scripts/model';
import { expect, assert } from 'chai';
import * as sinon from 'sinon';
let chai = require('chai');
chai.use(require('sinon-chai'));
import { View, PageElement, Slider, SliderTrack, SliderThumb, SliderFiller, ThumbFeedback, SliderScale } from '../../src/scripts/view';

let rootHTML: HTMLElement = document.createElement('div');
document.getElementsByTagName('body')[0].append(rootHTML);
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

        assert.deepEqual(testHTMLElement, sampleHTMLElement)
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
          
          assert.deepEqual(testHTMLElement, sampleHTMLElement);          
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
      let testThumb = new SliderThumb('thumb', 'thumb', rootHTML);

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
        assert.isEmpty(testThumb.htmlObject.style);
      })
    })

    describe('Тестирование метода setListeners, устанавливающего слушатели на события бегунка', ()=>{
      let testThumb: SliderThumb = new SliderThumb('thumb', 'thumb', rootHTML);
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
        let testThumb: SliderThumb = new SliderThumb('thumb', 'thumb', rootHTML);
        it('Проверка свойств объекта бегунка', ()=> {
          testThumb.manageFeedback(true);
          assert.instanceOf(testThumb.feedback, ThumbFeedback);
        })
      })
      describe('Режим работы без фидбека', ()=>{
        let testThumb: SliderThumb = new SliderThumb('thumb', 'thumb', rootHTML);
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
        let testThumb: SliderThumb = new SliderThumb('thumb', 'thumb', rootHTML);
        testThumb.verticalView = false;
        testThumb.move(position);
        assert.equal(testThumb.htmlObject.style.left, '50%');
      })

      it('Перемещение бегунка при вертикальной ориентации слайдера в позицию 50% от верхнего края родительского html-элемента', ()=> {
        let testThumb: SliderThumb = new SliderThumb('thumb', 'thumb', rootHTML);
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
        let testThumb: SliderThumb = new SliderThumb('thumb', 'thumb', localRootHTML);
        testThumb.htmlObject.style.position = 'absolute';

        it('Вызов метода с аргументом, в атрибут dataset-position записывается значение аргумента', ()=> {
          testThumb.setPositionAttribute(0.5);
          assert.equal(testThumb.htmlObject.dataset.position, '0.5');
        })

        it('Вызов метода без аргумента, в атрибут dataset-position записывается текущая координата бегунка, ', ()=> {
          testThumb.htmlObject.style.left = '60%';
          testThumb.setPositionAttribute();
          assert.equal(testThumb.htmlObject.dataset.position, '0.6');
        })
      })

    describe('Тестирование преобразования объекта бегунка к примитивному значению (метод [Symbol.toPrimitive])',()=> {
      let testThumb: SliderThumb = new SliderThumb('thumb', 'thumb', rootHTML);
      
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
          assert.isEmpty(testFiller.htmlObject.style);
        })

        it('Проверка при вертикальной ориентации слайдера', ()=> {
          testFiller.htmlObject.style.top = '40%';
          testFiller.htmlObject.style.height = '40%';
          testFiller.changeOrientation(true);        
          assert.isEmpty(testFiller.htmlObject.style);
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

        assert.deepEqual(scaleNode, sampleNode);
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
        assert.deepEqual(testElement, sampleElement);
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
        
        
        assert.deepEqual(testElement, sampleElement);
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

    describe('Тестирование метода setThumbFeedbacks, добавляющего отображение текущих значений над бегунками (далее - фидбеки). '+
    'Метод вызывает соответствующий метод класса SliderThumb для каждого экземпляра класса SliderThumb', ()=> {
      let thumbsCountCollection: number[] = [1, 2, 6];
      let testView = new View();
      let spy = sinon.spy();

      thumbsCountCollection.forEach(function(thumbsCount) {        
        it('Проверка работы метода при количестве экземпляров класса SliderThumb равное ' + thumbsCount, ()=> {
          SliderThumb.prototype.manageFeedback = spy;
          testView.sliderThumbs.length = 0;
          spy.resetHistory();
          
          for (let i = 0; i < thumbsCount; i++) {
            testView.sliderThumbs.push(new SliderThumb('thumb', 'thumb', rootHTML))
          }

          testView.setThumbFeedbacks();

          expect(spy).to.have.callCount(thumbsCount);                 
        })            
      }) 
    })
  })
})
 

