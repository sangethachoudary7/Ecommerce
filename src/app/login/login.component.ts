import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ProductCatalogueComponent } from '../product-catalogue/product-catalogue.component';
import { AuthService } from '../service/auth.service';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { Login } from '../interface/login';
import { GlobalService } from '../service/global.service';

export function customPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passWord = control.value;

    if (!passWord) {
      return { required: 'Password is required' };
    }
    const hasLowerCase = /[a-z]/.test(passWord);
    const hasNumeric = /[0-9]/.test(passWord);
    const hasMinLength = passWord.length >= 4;

    const validationErrors: ValidationErrors = {};

    if (!hasLowerCase) {
      validationErrors['lowercase'] =
        'Password must contain at least one lowercase letter';
    }

    if (!hasNumeric) {
      validationErrors['numeric'] = 'Password must contain at least one number';
    }

    if (!hasMinLength) {
      validationErrors['minLength'] =
        'Password must be at least 8 characters long';
    }

    return Object.keys(validationErrors).length ? validationErrors : null;
  };
}
@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class AuthenticationComponent implements OnInit {
  loginForm!: FormGroup;
  uName: string | null = null;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private globalServ: GlobalService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      passWord: ['', Validators.required],
      rememberMe: [false],
    });

    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe) {
      this.loginForm.controls['rememberMe'].setValue(true);
    }
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.uName = navigation.extras.state['userName'];
    }
  }

  isPasswordValid() {
    const passwordControl = this.loginForm.controls['passWord'];
    return (
      passwordControl.invalid &&
      (passwordControl.touched || passwordControl.dirty)
    );
  }
  isUsernameValid() {
    const unameCheck = this.loginForm.controls['userName'];
    return unameCheck.invalid && (unameCheck.dirty || unameCheck.touched);
  }
  onSubmit() {
    this.globalServ.startLoading();
    if (this.loginForm.valid) {
      const { userName, passWord, rememberMe } = this.loginForm.value;
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      const loginData: Login = {
        UserName: userName,
        UserPassword: passWord,
      };
      this.authService
        .login(loginData)
        .pipe(
          switchMap((response) => {
            if (response && response.result) {
              const { password, ...userWithoutPassword } = response.data;

              sessionStorage.setItem(
                'userDetails',
                JSON.stringify(userWithoutPassword)
              );
              return this.router.navigateByUrl('/catalogue');
            } else {
              alert(response.message);
              return of(null);
            }
          }),
          catchError((e) => {
            return of(null);
          }),
          finalize(() => {
            this.globalServ.stopLoading(); // Stop loading in all cases
          })
        )
        .subscribe();
    } else {
      console.log('Form is invalid!');
    }
  }
}
