export class ButtonInput {
  text?: string;
  imageSrc?: string;
  action?: {};
  clazz?: {[x: string]: boolean};

  constructor({
                text= '',
                imageSrc= '',
                action= {},
                clazz= {}}: {text?: string, imageSrc?: string, action?: {}, clazz?: {[x: string]: boolean}}) {
    this.text = text;
    this.imageSrc = imageSrc;
    this.action = action;
    this.clazz = clazz;
  }
}
