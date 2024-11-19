import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Registration } from '../interface/register';
import { catchError, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      mobileNo: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      Password: [
        '',
        [Validators.required, this.authService.customPasswordValidator()],
      ],
    });
  }
  isUsernameValid() {
    const un = this.registerForm.controls['userName'].value;
    if (un) {
      return un.invalid && (un.touched || un.dirty);
    }
  }
  isPasswordValid() {
    const pw = this.registerForm.controls['Password'].value;
    if (pw) {
      return pw.invalid && (pw.touched || pw.dirty);
    }
  }
  isMobileNoValid() {
    const mn = this.registerForm.controls['mobileNo'].value;
    if (mn) {
      return mn.invalid && (mn.touched || mn.dirty);
    }
  }
  onSubmit() {
    if (this.registerForm.valid) {
      const { userName, mobileNo, Password } = this.registerForm.value;
      const regData: Registration = {
        Name: userName,
        MobileNo: mobileNo,
        Password: Password,
      };
      this.authService
        .registerCustomer(regData)
        .pipe(
          switchMap((resp) => {
            if (resp.result) {
              this.toastr.success(resp.message);
              return this.router.navigateByUrl('/login', {
                state: { userName: userName },
              });
            } else {
              this.toastr.warning(resp.message);
              this.router.navigateByUrl('/register');
              return of(null);
            }
          }),
          catchError((error) => {
            this.toastr.error(error);
            return of(null);
          })
        )
        .subscribe();
    }
  }
  login() {
    this.router.navigateByUrl('/login');
  }
}
