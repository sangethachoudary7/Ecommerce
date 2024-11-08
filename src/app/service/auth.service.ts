import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api, LoginApi } from './constant/constant';
import { map, catchError, throwError, Observable } from 'rxjs';
import { Login, Login1Response, LoginResponse } from '../interface/login';
import { Registration, RegistrationResponse } from '../interface/register';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  customPasswordValidator(): ValidatorFn {
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
        validationErrors['numeric'] =
          'Password must contain at least one number';
      }

      if (!hasMinLength) {
        validationErrors['minLength'] =
          'Password must be at least 4 characters long';
      }

      return Object.keys(validationErrors).length ? validationErrors : null;
    };
  }

  login(uname: string, pword: string): Observable<any> {
    const loginData = {
      username: uname,
      password: pword,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log('Login data:', loginData);
    return this.http
      .post<LoginResponse>(
        LoginApi.loginUrl + LoginApi.METHODS.LOGIN,
        loginData,
        {
          headers,
        }
      )
      .pipe(
        map((response) => {
          console.log('Login response:', response);

          if (response && response.token) {
            localStorage.setItem('authToken', response.token);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Login request failed', error);
          return throwError(() => error);
        })
      );
  }
  login1(logData: Login): Observable<any> {
    // const loginData = {
    //   UserName: uname,
    //   UserPassword: pword,
    // };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json-patch+json',
      accept: 'text/plain',
    });
    console.log('Login data:', logData);
    return this.http
      .post<Login1Response>(Api.API_URL + Api.METHODS.LOGIN, logData, {
        headers,
      })
      .pipe(
        map((response) => {
          console.log('Login response:', response);

          if (response.result && response.data) {
            localStorage.setItem('authToken', response.data.name);
          } else {
            console.error('Login failed:', response.message);
            alert(response.message); // D
          }
          return response;
        }),
        catchError((error) => {
          console.error('Login request failed', error);
          return throwError(() => error);
        })
      );
  }
  registerCustomer(regData: Registration): Observable<RegistrationResponse> {
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      accept: 'text/plain',
    });
    return this.http
      .post<RegistrationResponse>(Api.API_URL + Api.METHODS.REGISTER, regData, {
        headers,
      })
      .pipe(
        map((responce: RegistrationResponse) => {
          console.log('Registration response', responce);
          return responce;
        }),
        catchError((error) => {
          console.log('registration request fails', error);
          return throwError(() => error);
        })
      );
  }
}
