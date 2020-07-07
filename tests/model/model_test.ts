/// <reference path="../../src/scripts/app.d.ts" />
import { Model } from '../../src/scripts/model';
import { expect, assert } from 'chai';
//import { assert } from 'chai/lib/Chai';
/*const chai = require('chai');
const assertArrays = require('chai-arrays');
chai.use(assertArrays);*/

describe('Проверка методов экземпляров класса Model', ()=> {
  describe('Проверка метода setCurrentValues(values: number[]| number, index?: number), '+
    'устанавливающего в свойство currentValues экземпляра класса Model текущие данные', ()=> {
    let testModel: Model = new Model();
    it('Установка значения [0.2]', ()=> {
      testModel.setCurrentValues([0.2]);
      assert.deepEqual(testModel.currentValues, [0.2]);      
    })

    it('Установка значения [0.2, 0.5]', ()=> {
      testModel.setCurrentValues([0.2, 0.5]);
      assert.deepEqual(testModel.currentValues, [0.2, 0.5]);
    })

    it('Установка значения одной из границ диапазона', ()=> {
      testModel.currentValues = [0.2, 0.5];
      testModel.setCurrentValues(0.4, 1);
      assert.deepEqual(testModel.currentValues, [0.2, 0.4]);
    })
  })

  describe('Проверка метода getCurrenValues, '+
  'возвращающего значение свойства currentValues экземпляра класса Model (текущее значение слайдера, в долях единицы)', ()=> {
    let testModel: Model = new Model();
    it('Получение значения [0.2]', ()=> {
      testModel.currentValues = [0.2];
      assert.deepEqual(testModel.getCurrenValues(), [0.2]);      
    })

    it('Установка значения [0.2, 0.5]', ()=> {
      testModel.currentValues = [0.2, 0.5];
      assert.deepEqual(testModel.getCurrenValues(), [0.2, 0.5]); 
    })
  })

  describe('Проверка метода checkValues(values: number, index: number), '+
  'анализирующего поступающие из View через презентер вероятные координаты бегунка', ()=> {
    let testModel: Model = new Model();

    describe('Проверка на выход за заданные границы величины', ()=> {
      it('Вероятное значение выбираемой величины в пределах заданной границы', ()=> {
        assert.isTrue(testModel.checkValues(0.9));
      })

      it('Вероятное значение выбираемой величины больше заданной границы', ()=> {
        assert.isFalse(testModel.checkValues(1.5));
      })

      it('Вероятное значение выбираемой величины меньше заданной границы', ()=> {
        assert.isFalse(testModel.checkValues(-1));
      })
    })

  })

  describe('Проверка метода checkPossibleMove, проверяющего возможность изменения границ пользовательского диапазона '+
    'или значения выбираемой величины', ()=> {
    let testModel: Model = new Model();
    testModel.currentValues = [0.5, 0.8];

    describe('Проверка на отрицательный выбранный диапазон', ()=> {
     
      it('Левая граница диапазона больше вероятной правой границы диапазона. Свойство currentValues в ходе работы метода не меняется', ()=> {                
        assert.isFalse(testModel.checkPossibleMove(0.4, 1));
        assert.deepEqual(testModel.currentValues, [0.5, 0.8]);
      })

      it('Правая граница диапазона меньше вероятной левой границы диапазона. Свойство currentValues в ходе работы метода не меняется', ()=> {                
        assert.isFalse(testModel.checkPossibleMove(0.9, 0));
        assert.deepEqual(testModel.currentValues, [0.5, 0.8]);
      })

      it('Левая граница диапазона равна вероятной правой границе диапазона', ()=> {
        assert.isTrue(testModel.checkPossibleMove(0.5, 1));
        assert.deepEqual(testModel.currentValues, [0.5, 0.8]);
      })

      it('Левая граница диапазона меньше вероятной правой границы диапазона', ()=> {        
        assert.isTrue(testModel.checkPossibleMove(0.7, 0));
        assert.deepEqual(testModel.currentValues, [0.5, 0.8]);
      })
    })

    describe('Сравнение смещения границы диапазона или выбираемого значения относительно заданного шага', ()=> {
      let testModel: Model = new Model();
      testModel.currentValues = [0.5, 0.8];
      testModel.step = 0.1;
      it('Вероятное смещение правой границы пользовательского диапазона меньше заданного шага', ()=> {
        assert.isFalse(testModel.checkPossibleMove(0.85, 1));
      })

      it('Вероятное смещение левой границы пользовательского диапазона больше заданного шага', ()=> {
        assert.isTrue(testModel.checkPossibleMove(0.95, 1));
      })
    })
  })

  describe('Проверка метода findRangeEdge, определяющего сторону границы выбираемого пользователем диапазона величины слайдера. '+
    'Данный метод используется в ситуациях, '+
    'когда пользователь на слайдере выполняет клик мышью в произвольном месте трека или шкалы слайдера.', ()=> {
      let testModel: Model = new Model();
      testModel.currentValues = [0.2, 0.8];
      it('Получено значение 0.9. Выбирается правая граница пользовательского диапазона', ()=> {
        assert.equal(testModel.findRangeEdge(0.9), 1);
      })

      it('Получено значение 0.51. Выбирается правая граница пользовательского диапазона', ()=> {
        assert.equal(testModel.findRangeEdge(0.51), 1);
      })

      it('Получено значение 0.5. Выбирается правая граница пользовательского диапазона', ()=> {
        assert.equal(testModel.findRangeEdge(0.5), 1);
      })

      it('Получено значение 0.49. Выбирается левая граница пользовательского диапазона', ()=> {
        assert.equal(testModel.findRangeEdge(0.49), 0);
      })

      it('Получено значение 0.1. Выбирается левая граница пользовательского диапазона', ()=> {
        assert.equal(testModel.findRangeEdge(0.1), 0);
      })
  })

  describe('Проверка метода calcCurrentValue, проводящего расчет текущего значения границы пользовательского диапазона или'+
  'конкретной величины на основе потенциального (поступающего из вне) значения', ()=> {
    let testModel: Model = new Model();
    testModel.currentValues = [0.2, 0.8]
    it('Расчет величины при нулевом шаге хода слайдера', ()=> {
      assert.equal(testModel.calcCurrentValue(0.5, 1), 0.5);
    })

    it('Расчет величины при не нулевом шаге (0.1) хода слайдера (величина изменяется в большую сторону)', ()=> {
      testModel.step = 0.1;
      assert.equal(testModel.calcCurrentValue(0.38, 0), 0.3);
    })

    it('Расчет величины при не нулевом шаге (0.2) хода слайдера (величина изменяется в большую сторону)', ()=> {
      testModel.step = 0.2;
      assert.equal(testModel.calcCurrentValue(0.78, 0), 0.6);
    })

    it('Расчет величины при не нулевом шаге (0.2) хода слайдера (величина изменяется в меньшую сторону)', ()=> {
      testModel.step = 0.1;
      assert.equal(testModel.calcCurrentValue(0.25, 1), 0.3);
    })

    it('Расчет величины при не нулевом шаге (0.2) хода слайдера (величина изменяется в меньшую сторону)', ()=> {
      testModel.step = 0.2;
      assert.equal(testModel.calcCurrentValue(0.25, 1), 0.4);
    })
  })
})