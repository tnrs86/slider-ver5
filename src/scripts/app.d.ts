interface SliderOptions {
  minPossibleValue?: number;
  maxPossibleValue?: number;
  rangeMode?: boolean;
  startSelectedRange?: number;
  endSelectedRange?: number;
  step?: number;
  useScale?: boolean;
  stepScale?: number;
  noNumericValues?: boolean;
  noNumericScale?: {};
  externalRecievers?: HTMLInputElement[];
  usefeedBack?: boolean, 
  verticalView?: boolean  
}

interface ViewConfig {
  rangeMode: boolean;
  verticalView: boolean;
  useScale: boolean;
  useFeedback: boolean;
}
interface ControlOptions {
  vertical?: boolean;
  range?: boolean;
  feedback?: boolean; 
  scale?: boolean;
  step?: number;
  min_value?: number;
  max_value?: number;
}

interface Window {
  HTMLElement: any
}