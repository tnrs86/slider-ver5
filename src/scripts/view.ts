/// <reference path="./app.d.ts" />
export class View {  
  rangeMode: boolean = false;
  useFeedback: boolean = false;
  verticalView: boolean = false;
  slider: Slider;
  sliderTrack: SliderTrack;
  sliderThumbs: SliderThumb[] = [];
  sliderFiller: SliderFiller;
  sliderScale: SliderScale;
  activeThumb: SliderThumb;
  externalPositionHandler: Function;
  controlPanel: ControlPanel;
  parentElement: HTMLElement;

  setBaseConfiguration(parentElement: HTMLElement): void { //tested
    this.slider = new Slider('slider', 'slider', parentElement);
    this.sliderTrack = new SliderTrack('track', 'slider__track', this.slider.htmlObject);    
    this.sliderThumbs.push(new SliderThumb('thumb', 'slider__thumb', this.sliderTrack.htmlObject, this.setActiveThumb.bind(this)));
  }

  setRangeMode(): void {//tested
    /* istanbul ignore else */
    if  (!this.rangeMode) {
      this.rangeMode = true;
      this.sliderThumbs.push(new SliderThumb('thumb', 'slider__thumb', this.sliderTrack.htmlObject, this.setActiveThumb.bind(this)));
      this.sliderFiller = new SliderFiller('filler', 'slider__filler', this.sliderTrack.htmlObject);
    } 
  }

  setSingleMode(): void { //tested
    this.rangeMode = false;
    this.sliderThumbs[1].removeHTMLElement(); //no tested
    this.sliderThumbs.length = 1;
    this.sliderFiller.removeHTMLElement(); //no tested
    this.sliderFiller = undefined;
  }

  setThumbFeedbacks(): void { //tested
    this.useFeedback = true;
    this.sliderThumbs.forEach((thumb)=>{      
      thumb.manageFeedback(true);     
    })    
  }

  removeThumbFeedback(): void { //tested
    this.useFeedback = false;
    this.sliderThumbs.forEach((thumb)=>{      
      thumb.manageFeedback(false);     
    })   
  }

  setScale(scaleData:{}): void { //tested    
    this.sliderScale = new SliderScale('scale', 'slider__scale', this.slider.htmlObject, scaleData);
  }

  removeScale(): void { //tested
    this.sliderScale.removeHTMLElement();
    this.sliderScale = undefined;
  }

  setSliderOrientation(verticalView?: boolean, sliderElement?: PageElement ): void { //tested
    
    if (typeof verticalView === 'undefined') { //subtested
      if (typeof this.verticalView !== 'undefined') {
        //ветка активируется, если надо установить ориентацию для элемента слайдера такую же, как и у всего слайдера
        verticalView = this.verticalView;        
      } else {  //subtested
        console.warn('Метод setSliderOrientation не сработал, отсутствуют данные об ориентации');
        return;
      }
    }

    if (sliderElement) {  //subtested
      
      sliderElement.changeOrientation(verticalView);      
      return;
    }

    this.verticalView = verticalView;
    Object.keys(this).forEach((key)=> {
      if (this[key] instanceof PageElement) {
        this[key].changeOrientation(verticalView)
      }
    })

    this.sliderThumbs.forEach((thumb)=> {        
      thumb.changeOrientation(verticalView);
    })
  }

  setElementPositions(positions: number[]|number, index?: number, feedbackContent?: string): void { //tested
    if ( typeof positions == 'object' && typeof index == 'undefined') { //tested
      this.sliderThumbs.forEach((thumb, index)=> {
        thumb.move(positions[index], feedbackContent);
        thumb.setPositionAttribute(positions[index]);
      })

      if (this.sliderFiller) {
        this.sliderFiller.move(positions as number[]);
      }

    } else if (typeof positions == 'number' && typeof index == 'number' ) { //tested
      
      this.sliderThumbs[index].move(positions, feedbackContent);
      this.sliderThumbs[index].setPositionAttribute(positions);
      
      if (this.sliderFiller) {        
        this.sliderFiller.move([this.sliderThumbs[0].getPositionAttribute(), this.sliderThumbs[1].getPositionAttribute()]);        
      }
      
    } else { //subtested
      console.warn('Метод setElementPositions не сработал. Не достаточно параметров. Укажите индекс перемещаемого бегунка.');   
    }
  }

  setListeners(positionHandler: Function, resizeHandler: Function): void { //tested
    this.externalPositionHandler = positionHandler;
    
    window.addEventListener('resize', ()=> { 
      resizeHandler();
    })
    
    if (this.sliderTrack && this.sliderThumbs[0]) {
       
      this.sliderTrack.setListeners(this.positionHandler.bind(this), this.setActiveThumb.bind(this));

      if (this.sliderScale) {
        this.sliderScale.setListeners(this.positionHandler.bind(this)); 
      }
     
    } else { //tested
      throw(new Error('Не установлены элементы управления слайдером!'));
    }
  }

  setElementListener(element: PageElement | HTMLElement, handler: Function, event: string): void { //tested
    let desiredElement: HTMLElement;
    
    if (element instanceof PageElement) {
      desiredElement = element.htmlObject;
    } else {
      desiredElement = element;      
    }
    
    if (typeof desiredElement[event] === 'object') {
      desiredElement[event] = handler;     
    } else {
      throw (new Error('Слушатель не установлен: задано неверное событие'));
    }
  }

  positionHandler(position: number, eventType: string): void { //tested
    //обработчик данных, полученных при срабатывании событий на элементах

    //переработать: на выходе должно быть число или число и индекс
    let results: number[] = [];
    
    if (eventType == 'mousemove') {      
      if (this.activeThumb) {
        let index: number;
        index = this.sliderThumbs.indexOf(this.activeThumb);
        this.externalPositionHandler(position, index);
      }
    } else if (eventType == 'mousedown') {
      results.push(position);
      this.externalPositionHandler(position);
    } else {
      throw (new Error('Передано неверное событие'));
    }
  }

  setActiveThumb(currentThumb: SliderThumb | undefined): void { //tested
    this.activeThumb = currentThumb;
  }

  getSliderSize(verical?: boolean): number { //tested
    
    if (typeof verical == 'undefined') {      
      if (typeof this.verticalView != 'undefined') {        
        if (this.verticalView) {                    
          return this.sliderTrack.htmlObject.clientHeight;
        }          
        return this.sliderTrack.htmlObject.clientWidth;
                
      } else { //subtested        
        console.warn('Не задан параметр ориентации слайдера!');
        return undefined;
      }
    } else {      
      if (verical) {        
        return this.sliderTrack.htmlObject.clientHeight;
      } else {        
        return this.sliderTrack.htmlObject.clientWidth; 
      }
    }
  }

  setControlPanel(parentElement: HTMLElement, input1?: HTMLInputElement, input2?: HTMLInputElement): void { //tested
    this.controlPanel = new ControlPanel(parentElement, input1, input2);
  }

  setControlPanelValues(value: string, index: number): void { //tested
    this.controlPanel.setValue(value, index);
  }

  setControlPanelParameters(param: {}): void { //tested
    this.controlPanel.setParameters(param);
  }

  setControlPanelListener(dataHandler: Function): void { //tested
    this.controlPanel.setListeners(dataHandler);
    
  }
}

export class PageElement {

  name: string;
  htmlObject: HTMLElement;
  verticalView: boolean;
  view: View;
  className: string; 
  
  constructor(name: string, className: string, parent: HTMLElement) {
    this.name = name;
    this.className = className;
    this.htmlObject  = this.createHTMLElement(className);    
    parent.appendChild(this.htmlObject);      
  }

  createHTMLElement(className:string): HTMLElement {//testetd
    
    let result: HTMLElement;
    
    result = document.createElement('div');   
    result.className = className;
    
    return result;
  }

  changeOrientation(verticalView: boolean): void {//testetd
    this.verticalView = verticalView;
  }

  removeHTMLElement(): void { //tested
    this.htmlObject.remove();
  }
}

export class Slider extends PageElement {
  changeOrientation(verticalView: boolean) { //tested    
    if (this.verticalView != verticalView) { //subtested
      super.changeOrientation(verticalView);
    
      if (verticalView) {        
        this.htmlObject.className = this.className + ' ' + this.className + '_vertical';        
      } else {
        this.htmlObject.className = this.className + ' ' + this.className + '_horizontal';        
      }
    }    
  }
}

export class SliderTrack extends PageElement {
  setListeners(eventHandler: Function, setCurrentThumb: Function): void { //tested!? (no tested interfaces)
    
    this.htmlObject.onmousemove = (event)=> {
      //передавать дальше расстояние в долях от единицы
      let result: number;
      if (this.verticalView) {
        result = (event.clientY - this.htmlObject.getBoundingClientRect().top) / this.htmlObject.clientHeight;
      } else {
        result = (event.clientX - this.htmlObject.getBoundingClientRect().left) / this.htmlObject.clientWidth;
      }
      eventHandler(result, event.type);
    }

    this.htmlObject.onmouseleave = ()=> {      
      setCurrentThumb(undefined);
    }

    this.htmlObject.onmousedown = ()=> {
      //передавать дальше расстояние в долях от единицы      
    }

    this.htmlObject.onmouseup = ()=> {
      setCurrentThumb(undefined);
    }     
  }
}

export class ThumbFeedback extends PageElement {
  setValue(value: string): void { //tested
    this.htmlObject.textContent = value;
  }
}

export class SliderThumb extends PageElement {
  feedback: ThumbFeedback;
  feedbackClassName: string = 'thumb__feedback';
  constructor(name: string, className: string, parent: HTMLElement, clickEvent: Function) {
    super(name, className, parent);

    this.setListeners(clickEvent);
  }
  setListeners(eventHandler: Function): void { //tested!? (no tested interfaces)
    
    this.htmlObject.onmousedown = ()=> {      
      eventHandler(this);
    }

    this.htmlObject.onmouseup = ()=> {
      eventHandler(undefined);
    }
  }

  changeOrientation(verticalView: boolean): void { //tested
    super.changeOrientation(verticalView);
    
    while (this.htmlObject.style.length) {
      this.htmlObject.style.removeProperty(this.htmlObject.style[0])
    }

    if (this.feedback) {
      this.feedback.changeOrientation(verticalView);
    }
  }

  manageFeedback(useFeedback: boolean): void { //tested
    
    if (useFeedback) { 
      
      if (!this.feedback) {        
        this.feedback = new ThumbFeedback('feedback', this.feedbackClassName, this.htmlObject);
        return;
      } 
      
    } else {
      if (this.feedback) {
        this.feedback = undefined;        
        this.htmlObject.removeChild(this.htmlObject.getElementsByClassName(this.feedbackClassName)[0]); 
              
      }
    }
  }

  move(position: number, value?: string): void { //tested
    
    if (this.feedback) {
      this.feedback.setValue(value);
    }

    if (this.verticalView) {
      this.htmlObject.style.top = position * 100 + '%';
    } else {
      this.htmlObject.style.left = position * 100 + '%';
    }
  }

  setPositionAttribute(value?: number): void { //tested
      if (value) {      
      this.htmlObject.dataset.position = '' + value;
    } else {
      if (this.verticalView) {        
        this.htmlObject.dataset.position = '' + this.htmlObject.offsetTop / this.htmlObject.parentElement.offsetHeight;
        //throw new Error('' + this.htmlObject.offsetTop);
      } else {        
        this.htmlObject.dataset.position = '' + this.htmlObject.offsetLeft / this.htmlObject.parentElement.offsetWidth;
        //throw new Error('' + this.htmlObject.offsetLeft);
      }
    }
  }
  
  getPositionAttribute(): number { //tested
    return parseFloat(this.htmlObject.dataset.position);
  }
}

export class SliderFiller extends PageElement {
  move(positions: number[]): void { //tested
    if (this.verticalView) { //subtested
      this.htmlObject.style.top = positions[0]*100 + '%';
      this.htmlObject.style.height = (positions[1] - positions[0])*100 + '%';
    } else {//subtested
      this.htmlObject.style.left = positions[0]*100 + '%';
      this.htmlObject.style.width = (positions[1] - positions[0])*100 + '%';
    }
  }

  changeOrientation(verticalView: boolean): void { //tested
    super.changeOrientation(verticalView);
    while (this.htmlObject.style.length) {
      this.htmlObject.style.removeProperty(this.htmlObject.style[0]);
    } 

  }
}

export class SliderScale extends PageElement {
  constructor(name: string, className: string, parent:HTMLElement, scaleData: {}) {
    super(name, className, parent);
    super.createHTMLElement(className);

    let keysArray: number[];
    keysArray = Object.keys(scaleData).map((key)=>{ return parseFloat(key)});
    keysArray.sort((a, b)=>{return a-b})
    keysArray.forEach((key)=> {      
      this.htmlObject.appendChild(this.createScaleHTMLComponent(''+key, scaleData[key]))
    })      
  };

  createScaleHTMLComponent(position: string, text: string): HTMLElement { //tested
    let result: HTMLElement = document.createElement('div');
    result.className = 'scale__component';
    //position = parseFloat((parseFloat(position).toFixed(3)))*100  + '%';
    result.dataset.position = position;

    let mark = document.createElement('div');
    mark.className = 'scale__mark'; 
    result.appendChild(mark);    
    let markLabel = document.createElement('div');
    markLabel.className = 'scale__mark-label';    
    markLabel.textContent = text;
    result.appendChild(markLabel);

    return result;
  }

  changeOrientation(verticalView: boolean): void {//tested
    /* istanbul ignore else */
    if (this.verticalView != verticalView) {
      super.changeOrientation(verticalView);
      let classNameModificator: string = '_horizontal';
      let edge: string = 'left';
      if (verticalView) {
        classNameModificator = '_vertical';
        edge = 'top';
      }

      this.htmlObject.className = this.className + ' ' + this.className + classNameModificator;
      for (let i = 0; i< this.htmlObject.childNodes.length; i++) {              
        let node: HTMLElement = this.htmlObject.childNodes[i] as HTMLElement;        
        while (node.style.length) {
          node.style.removeProperty(node.style[0]);
        }
        
        node.style[edge] = parseFloat(node.dataset.position) * 100 + '%';      
      }
    }
  }

  setListeners(eventHandler: Function): void {
    this.htmlObject.onclick = ()=> {
      //передавать дальше расстояние в долях от единицы
    }
  }
}

export class ControlPanel {
  externalRecievers: HTMLInputElement[] = [];  
  elements: HTMLInputElement[];
  formObject: HTMLFormElement;
  constructor(parent: HTMLElement, input1?: HTMLInputElement, input2?: HTMLInputElement) {
    
    if (input1) {
      this.externalRecievers.push(input1);
    }

    if (input2) {
      this.externalRecievers.push(input2);
    }
    
    //получить перечень элементов
    
    this.formObject = parent.parentElement.querySelector('form[name="control-panel"') as HTMLFormElement;
    this.elements = Array.from(this.formObject.getElementsByClassName('control-panel__input')) as HTMLInputElement[];
  }

  setListeners(eventHandler: Function): void { //tested
    this.elements.forEach((element)=> {      
      element.onchange = ()=> {
        let value: number|boolean;
        if (element.type == 'checkbox') {
          value = element.checked;
        } else {
          value = parseFloat(element.value);
        }
        eventHandler(value, element.name);
      }
    })
  }

  setValue(value: string, index: number): void { //tested    
    this.externalRecievers[index].value = value
  }

  setParameters(value: {}): void { //tested
    Object.keys(value).forEach((key)=> {
      let currentInput: HTMLInputElement = this.formObject.querySelector(`input[name="${key}"]`);
      if (currentInput.type == 'checkbox') {
        currentInput.checked = value[key];
      } else {
        currentInput.value = value[key];
      }      
    })
  }
 
  getElements(): {} { //tested
    return this.elements;
  }

}