import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UiService} from "./services/ui.service";
import {AuthService} from "./services/auth.service";
import {DataService} from "./services/data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'JantererTube';

  loggedInUser: string = null;

  constructor(private authService: AuthService, private dataService: DataService) { }

  ngOnInit(): void {
    let sessionUser: string = this.authService.getSessionUser();
    if (sessionUser) {
      this.loggedInUser = sessionUser;
      this.dataService.emitLoggedInUserData(sessionUser);
    }
  }
}
