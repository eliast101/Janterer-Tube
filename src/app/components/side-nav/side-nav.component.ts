import {Component, OnDestroy, OnInit} from '@angular/core';
import {UiService} from "../../services/ui.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit, OnDestroy {

  showHideSideNav: boolean = false;

  onShowHideSideNavSubscription: Subscription;

  constructor(private uiService: UiService) {
    this.onShowHideSideNavSubscription = this.uiService.onShowHideSideNav().subscribe(val => this.showHideSideNav = val);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onShowHideSideNavSubscription.unsubscribe();
  }

}
