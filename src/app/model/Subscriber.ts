export class Subscriber {
  id?: number;
  subscribeTo?: string;
  subscribeFrom?: string;

  constructor({
                id,
                subscribeTo,
                subscribeFrom
  } : {id?: number, subscribeTo?: string, subscribeFrom?: string} = {}) {
    this.id = id;
    this.subscribeTo = subscribeTo;
    this.subscribeFrom = subscribeFrom;
  }
}
