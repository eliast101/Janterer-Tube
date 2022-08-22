import {Directive, Input, OnInit} from '@angular/core';
import {AbstractControl, FormControl, NG_VALIDATORS, ValidationErrors, Validator} from "@angular/forms";

@Directive({
  selector: '[appValueMatching]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ValueMatchingDirective,
      multi: true
    }
  ]
})
export class ValueMatchingDirective implements Validator, OnInit {

  @Input() otherValControl: FormControl;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * This directive checks if current element value matches with the provided element control value
   * @param control
   */
  validate(control: FormControl): ValidationErrors | null {
    // subscribing to "change" event on the other element is required because after filling both elements,
    // user might decide to go back and change the value for the other element
    this.otherValControl.valueChanges.subscribe(value => {
       control.value !== value ? control.setErrors({'valueMatch': true}) : control.setErrors(null);
    });
    return control.value !== this.otherValControl.value ? {'valueMatch': true} : null;
  }

}
