import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'app-control-message',
  template: `
    <ng-container *ngIf="errorMessage !== null">{{ errorMessage }}</ng-container>
  `
})
export class ControlMessageComponent {
  @Input() control: FormControl;
  constructor() {}

  get errorMessage() {
    for (const propertyName in this.control.errors) {
      if (
        this.control.errors.hasOwnProperty(propertyName) &&
        this.control.touched
      ) {
        return ValidationService.getValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName]
        );
      }
    }
    return null;
  }
}
