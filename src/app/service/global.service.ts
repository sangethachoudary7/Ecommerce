import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interface/login';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  userDetails!: User;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  constructor() {}
  startLoading() {
    this.loadingSubject.next(true);
  }

  stopLoading(delay: number = 500) {
    setTimeout(() => {
      this.loadingSubject.next(false);
    }, delay);
  }

  getUserDetails(): User {
    const userDetailsString = sessionStorage.getItem('userDetails');
    if (userDetailsString) {
      console.log('gs', this.userDetails);
      return (this.userDetails = JSON.parse(userDetailsString));
      // this.uDetails.emit(this.userDetails);
    } else {
      return (this.userDetails = {} as User);
    }
  }
}
