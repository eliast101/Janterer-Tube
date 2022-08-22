import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ButtonInput} from "../../../model/ButtonInput";

@Component({
  selector: 'app-button-provider',
  templateUrl: './button-provider.component.html',
  styleUrls: ['./button-provider.component.css', '../../../shared/button-provider.css']
})
export class ButtonProviderComponent implements OnInit {

  @Input() buttonInput: ButtonInput;

  @Input() replyButtonActive: boolean = false;

  @Input() additionalStyles: string[] = [];

  @Output() buttonClickEvent = new EventEmitter<{}>();

  constructor() { }

  ngOnInit(): void {
  }

  onButtonClick(action: {}) {
    this.buttonClickEvent.emit(action);
  }
}
