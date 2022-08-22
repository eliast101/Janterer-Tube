import { Injectable } from '@angular/core';
import {AppConstant} from "../constants/AppConstant";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  addUserToSession(username: string) {
    sessionStorage.setItem(AppConstant.SESSION_KEY, username);
  }

  getSessionUser(): string {
    return sessionStorage.getItem(AppConstant.SESSION_KEY);
  }
}
