import {Component, OnDestroy, OnInit} from '@angular/core';
import {UiService} from "../../services/ui.service";
import {DataService} from "../../services/data.service";
import {Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-main-section',
  templateUrl: './main-section.component.html',
  styleUrls: ['./main-section.component.css']
})
export class MainSectionComponent implements OnInit, OnDestroy {

  showHideSideNav: boolean = false;

  loggedInUser: string = null;

  onShowHideSideNavSubscription: Subscription;
  onLoggedInUserEventSubscription: Subscription;

  constructor(private uiService: UiService, private dataService: DataService, private authService: AuthService) {
    this.onShowHideSideNavSubscription = this.uiService.onShowHideSideNav().subscribe(val => this.showHideSideNav = val);
  }

  ngOnInit(): void {
    let sessionUser: string = this.authService.getSessionUser();
    if (sessionUser) {
      this.loggedInUser = sessionUser;
      this.dataService.emitLoggedInUserData(sessionUser);
    }
    this.onLoggedInUserEventSubscription = this.dataService.onLoggedInUserEvent().subscribe(userData => this.loggedInUser = userData.firstName);
  }

  ngOnDestroy(): void {
    this.onShowHideSideNavSubscription.unsubscribe();
    this.onLoggedInUserEventSubscription.unsubscribe();
  }

}
