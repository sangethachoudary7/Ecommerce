import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent {
  addressForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      address: ['', Validators.required],
      country: ['', Validators.required],
      zipcode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      city: ['', Validators.required],
      state: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.addressForm.valid) {
      console.log('Form Submitted:', this.addressForm.value);
    } else {
      console.error('Form is invalid');
    }
  }
}
