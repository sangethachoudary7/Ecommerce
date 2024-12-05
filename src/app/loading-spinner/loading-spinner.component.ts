import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ProductsService } from '../service/products.service';
import { Observable } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { GlobalService } from '../service/global.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css',
})
export class LoadingSpinnerComponent {
  public isLoading$!: Observable<boolean>;

  constructor(
    private globalServ: GlobalService,
    private cdRef: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.isLoading$ = this.globalServ.loading$;
    this.cdRef.detectChanges();
  }
}
