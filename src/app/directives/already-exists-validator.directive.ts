import { Directive } from '@angular/core';
import {AsyncValidator, FormControl, NG_ASYNC_VALIDATORS, ValidationErrors} from "@angular/forms";
import {Observable, of} from "rxjs";
import {DataService} from "../services/data.service";
import {map} from "rxjs/operators";

@Directive({
  selector: '[appAlreadyExistsValidator]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: AlreadyExistsValidatorDirective,
      multi: true
    }
  ]
})
export class AlreadyExistsValidatorDirective implements AsyncValidator {

  constructor(private dataService: DataService) { }

  validate(control: FormControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    let formGroup = control.parent.controls;
    let currentControlName: string = null;
    Object.keys(formGroup).forEach((name: string) => {
      if (control == formGroup[name]) {
        currentControlName = name;
      }
    });
    if (currentControlName) {
      const val: string = control.value;
      return this.dataService.filterUsersBy(currentControlName, val).pipe(map(userDataList => {
        if (userDataList.length !== 0) {
          return {userExists: true};
        }
        return null;
      }));
    }
    return of(null);
  }



}
