import * as cryptoJs from 'crypto-js';

export class AppUtil {

  private static secret: string = 'eiywreiu34348';

  static BUTTON_ACTION_OBJ = {parentComponent: 'parentComponent', action: 'action'};

  static encrypt(data: any): string {
    return cryptoJs.AES.encrypt(data, this.secret).toString();
  }

  static decrypt(encryptedData: string): string {
    return cryptoJs.AES.decrypt(encryptedData, this.secret).toString(cryptoJs.enc.Utf8);
  }

  static isValidButtonEventObject(event: {}): boolean {
    const {parentComponent, action} = AppUtil.BUTTON_ACTION_OBJ;
    return event.hasOwnProperty(parentComponent) && event.hasOwnProperty(action)
  }

  static calcTimeAgo(current, previous) {
    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerMonth = msPerDay * 30;
    let msPerYear = msPerDay * 365;

    let elapsed = current - previous;

    if (elapsed < msPerMinute) {
      let seconds = Math.floor(elapsed/1000);
      return seconds > 1 ? seconds + ' seconds ago' : seconds + ' second ago';
    }

    else if (elapsed < msPerHour) {
      let minutes = Math.floor(elapsed/msPerMinute);
      return minutes > 1 ? minutes + ' minutes ago' : minutes + ' minute ago';
    }

    else if (elapsed < msPerDay ) {
      let hours = Math.floor(elapsed/msPerHour );
      return hours > 1 ? hours + ' hours ago' : hours + ' hour ago';
    }

    else if (elapsed < msPerMonth) {
      let days = Math.floor(elapsed/msPerDay);
      return days > 1 ? days + ' days ago' : days + ' day ago';
    }

    else if (elapsed < msPerYear) {
      let months = Math.floor(elapsed/msPerMonth);
      return months > 1 ? months + ' months ago' : months + ' month ago';
    }

    else {
      let years = Math.floor(elapsed/msPerYear );
      return years > 1 ? years + ' years ago' : years + ' year ago';
    }
  }
}
