import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
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
}
