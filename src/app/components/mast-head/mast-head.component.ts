import { Component, OnInit } from '@angular/core';
import {UiService} from "../../services/ui.service";

@Component({
  selector: 'app-mast-head',
  templateUrl: './mast-head.component.html',
  styleUrls: ['./mast-head.component.css']
})
export class MastHeadComponent implements OnInit {

  constructor(private uiService: UiService) { }

  ngOnInit(): void {
  }

  showHideSideNav() {
    this.uiService.emitShowHideSideNavEvent();
  }
}
