declare module NodeJS  {
  interface Global {
    document: Document,
    window: Window,
    HTMLElement: any
  }
}