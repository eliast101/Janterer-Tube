import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-user-profile-button',
  templateUrl: './user-profile-button.component.html',
  styleUrls: ['./user-profile-button.component.css', '../../../shared/profile-picture.css']
})
export class UserProfileButtonComponent implements OnInit {

  @Input() styleClasses: string[] = [];

  @Input() profilePicture: string;

  constructor() { }

  ngOnInit(): void {
  }

}
