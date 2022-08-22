import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormValidationErrorMessages} from "../../shared/FormValidationErrorMessages";
import {NgForm} from "@angular/forms";
import {User} from "../../model/User";
import {DataService} from "../../services/data.service";
import {AppUtil} from "../../shared/AppUtil";
import {UserData} from "../../model/UserData";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css', '../../shared/auth-form.css']
})
export class SigninComponent implements OnInit, OnDestroy {

  formErrorMessages: FormValidationErrorMessages = new FormValidationErrorMessages();

  loginSuccessful: boolean = false;

  loginSubmitted: boolean = false;

  filterUsersBySubscription: Subscription;

  constructor(private dataService: DataService, private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  signIn(signInForm: NgForm) {
    this.loginSubmitted = true;
    const {username, password}: User = signInForm.value;

    this.filterUsersBySubscription = this.dataService.filterUsersBy('username', username).subscribe(userDataList => {
      let userData: UserData = userDataList[0];
      this.loginSuccessful = userData && AppUtil.decrypt(userData.password) === password;
      if (this.loginSuccessful) {
        this.authService.addUserToSession(username);
        this.router.navigateByUrl('/');
      } else {
        // clean password for user
        signInForm.resetForm();
        signInForm.setValue({username: username, password: ''});
      }
    });
  }

  //@HostListener('window:beforeunload')
  /*async */
  ngOnDestroy(): void {
    if (this.filterUsersBySubscription) {
      this.filterUsersBySubscription.unsubscribe();
    }
  }
}
