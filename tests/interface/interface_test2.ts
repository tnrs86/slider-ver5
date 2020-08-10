import { expect, assert, Assertion } from 'chai';
import * as puppeteer from 'puppeteer';
import { async } from 'q';

let width: number = 1440;
let height: number = 700;
describe('Тест интерфейса', async ()=> {
  describe('Тестирование при вертикальной ориентации слайдера', async function () {
    this.timeout(10000)
    let browser: puppeteer.Browser;
    let page: puppeteer.Page;
    let sliderWrapper: puppeteer.ElementHandle;
    let sliderTrack: puppeteer.ElementHandle;
    let thumbs: puppeteer.ElementHandle[];

    beforeEach(async ()=> {
      browser = await puppeteer.launch({
        headless: true,
        slowMo: 80,
        args: [`--window-size=${width},${height}`]
      });
      page = await browser.newPage();
      await page.goto('d:/Материалы/Обучение/Coding/JS/Slider/v5/dist/about/page-1.html')
      await page.setViewport({ width, height });

      sliderWrapper = await page.$('#div1');        
      sliderTrack = await sliderWrapper.$('.slider__track');
      thumbs = await sliderTrack.$$('.slider__thumb');
    })

    afterEach(()=> {
      browser.close();
    })

    it('Тестирование перемещения бегунков', async ()=> {
      await thumbs[1].hover();          
      await page.mouse.down();
      await page.mouse.move(60, 310);
      await page.mouse.up();          
      const thumbPosition = await page.evaluate(el => el.offsetTop, thumbs[1]);      
      assert.equal(thumbPosition, 249);
    })


  })
  describe('Тестирование при горизонтальной ориентации слайдера', async function () {
    this.timeout(10000)
    let browser: puppeteer.Browser;
    let page: puppeteer.Page;
    let sliderWrapper: puppeteer.ElementHandle;
    let sliderTrack: puppeteer.ElementHandle;
    let thumbs: puppeteer.ElementHandle[];

    beforeEach(async ()=> {
      browser = await puppeteer.launch({
        headless: false,
        slowMo: 80,
        args: [`--window-size=${width},${height}`]
      });
      page = await browser.newPage();
      await page.goto('d:/Материалы/Обучение/Coding/JS/Slider/v5/dist/about/page-1.html')
      await page.setViewport({ width, height });

      sliderWrapper = await page.$('#div2');        
      sliderTrack = await sliderWrapper.$('.slider__track');
      thumbs = await sliderTrack.$$('.slider__thumb');
    })

    afterEach(()=> {
      browser.close();
    })

    it('Тестирование перемещения бегунков', async ()=> {
      await thumbs[0].hover();          
      await page.mouse.down();
      await page.mouse.move(600, 400);
      await page.mouse.up();          
      const thumbPosition = await page.evaluate(el => el.offsetLeft, thumbs[0]);
      assert.equal(thumbPosition, 549);
    })

    it('Тестирование реакции трека слайдер надействия пользователя (слайдер в режиме выбора единичного значения)', async ()=> {
      await sliderTrack.hover();          
      
      await page.mouse.click(600, 400);
               
      const thumbPosition = await page.evaluate(el => el.offsetLeft, thumbs[0]);      
      assert.equal(thumbPosition, 549);
    })
  })
})