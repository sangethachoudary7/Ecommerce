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
import { catchError, of, switchMap } from 'rxjs';
import { Login } from '../interface/login';

export function customPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passWord = control.value;

    if (!passWord) {
      return { required: 'Password is required' };
    }

    // const hasUpperCase = /[A-Z]/.test(passWord);
    const hasLowerCase = /[a-z]/.test(passWord);
    const hasNumeric = /[0-9]/.test(passWord);
    const hasMinLength = passWord.length >= 4;

    const validationErrors: ValidationErrors = {};
    // if (!hasUpperCase) {
    //   validationErrors['uppercase'] =
    //     'Password must contain at least one uppercase letter';
    // }

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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      passWord: ['', Validators.required],
      rememberMe: [false], // Default value for rememberMe
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
        .login1(loginData)
        .pipe(
          switchMap((response) => {
            if (response && response.result) {
              return this.router.navigateByUrl('/catalogue');
            } else {
              alert(response.message);
              return of(null);
            }
          }),
          catchError((e) => {
            return of(null);
          })
        )
        .subscribe();
    } else {
      console.log('Form is invalid!');
    }
  }
  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     const { userName, passWord, rememberMe } = this.loginForm.value;
  //     console.log('UserName:', userName, 'Password:', passWord);
  //     if (rememberMe) {
  //       localStorage.setItem('rememberMe', 'true');
  //     } else {
  //       localStorage.removeItem('rememberMe');
  //     }

  //     this.authService
  //       .login(userName, passWord)
  //       .pipe(
  //         switchMap((response) => {
  //           console.log('Response from login:', response);
  //           if (response && response.token) {
  //             // if (response && response.result) {
  //             return this.router.navigateByUrl('/products'); // navigate on success
  //           } else {
  //             alert(response.message);
  //             return of(null); // fallback if no token is returned
  //           }
  //         }),
  //         catchError((e) => {
  //           console.error('Login error', e);
  //           return of(null);
  //         })
  //       )
  //       .subscribe();
  //   } else {
  //     console.log('Form is invalid!');
  //   }
  // }
}

// loginForm = new FormGroup({
//   userName: new FormControl('', Validators.required),
//   passWord: new FormControl('', {
//     validators: [
//       Validators.required,
//       customPasswordValidator(),
//     ],
//   }),
//   rememberMe: new FormControl(false),
// });
