/// <reference path="../../src/scripts/app.d.ts" />
//import { Model } from '../../src/scripts/model';
import { expect, assert } from 'chai';
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
      it('Тестирование метода с параметрами', ()=> {
        ///////////////////////// ИЗМЕНИТЬ ОПИСАНИЕ В It
      })
    })
  })


  describe('Тестирование методов класса ThumbFeedback (расширенный класс PageElement), представляющего элемент с текстом над бегунком (далее - фидбек)', ()=> {
    describe('Тестирование метода setValue, устанавливающего TextContent для фидбека', ()=> {
      it('Тестирование метода с параметрами', ()=> {
        /////////////////////////
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

  let testView: View = new View();
  describe('Тестирование методов класса View', ()=> {
  
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

    describe('Тестирование метода setThumbFeedbacks, добавляющего отображение текущих значений над бегунками (далее - фидбеки)', ()=> {
      testView.setThumbFeedbacks();
      it('Установка свойства useFeedback объекта View равное true', ()=>{
        assert.isTrue(testView.useFeedback);
      })

      describe('Передача свойству feedback всех экземпляров класса SliderThumb ссылок на уникальные экземпляры класса ThumbFeedback', ()=>{
        testView.sliderThumbs.forEach((thumb, index)=>{

          it('Передача ссылки на экземпляр класса ThumbFeedback свойству feedback экземпляру класса SliderThumb №' + (index+1), ()=> {
            assert.instanceOf(thumb.feedback, ThumbFeedback);
          })
        })
      })
    })
  })
})
 

