import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../model/User";
import {FormValidationErrorMessages} from "../../shared/FormValidationErrorMessages";
import {AppUtil} from "../../shared/AppUtil";
import {UserData} from "../../model/UserData";
import {DataService} from "../../services/data.service";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css', '../../shared/auth-form.css']
})
export class SignUpComponent implements OnInit, OnDestroy {

  user: User;

  defaultProfileImage: string = 'assets/images/profilePictures/default.png';

  formErrorMessages: FormValidationErrorMessages = new FormValidationErrorMessages();

  persistUserSubscription: Subscription;

  constructor(private dataService: DataService, private authService: AuthService, private router: Router) {

  }

  ngOnInit(): void {
  }

  onSignUp(form: NgForm) {
    const user: User = form.value;
    let encryptedPass = AppUtil.encrypt(user.password);
    const userData = new UserData(user, encryptedPass, this.defaultProfileImage);

    this.persistUserSubscription = this.dataService.persistUser(userData).subscribe(usr => {
      this.authService.addUserToSession(usr.username);
      form.reset();
      this.router.navigateByUrl('/');
    }, error => console.log(error));
  }

  ngOnDestroy(): void {
    if (this.persistUserSubscription) {
      this.persistUserSubscription.unsubscribe();
    }
  }
}
