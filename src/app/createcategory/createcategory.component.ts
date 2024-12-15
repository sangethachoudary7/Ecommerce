import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { GlobalService } from '../service/global.service';

@Component({
  selector: 'app-createcategory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './createcategory.component.html',
  styleUrl: './createcategory.component.css',
})
export class CreatecategoryComponent {
  loginForm!: FormGroup;
  uName: string | null = null;
  constructor(
    private router: Router,
    private authService: AuthService,
    private globalServ: GlobalService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      CategoryName: ['', Validators.required],
      parentCategory: [''],
    });
  }
  createCategory() {}
  onSubmit() {}
}
