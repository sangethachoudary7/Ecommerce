import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-catagory',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-catagory.component.html',
  styleUrl: './create-catagory.component.css',
})
export class CreateCatagoryComponent {
  isParentCategory = true;
  parentCategoryName = '';
  subCategoryName = '';
  selectedParentCategory: string | null = null;

  // Mock list of parent categories
  parentCategories = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Fashion' },
    { id: '3', name: 'Home & Garden' },
  ];

  onCategoryTypeChange(event: any) {
    this.isParentCategory = event.target.value === 'parent';
  }

  addParentCategory() {
    if (!this.parentCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }
    // Save the parent category (mock implementation)
    console.log('Added Parent Category:', this.parentCategoryName);
    this.parentCategoryName = '';
    alert('Parent Category added successfully!');
  }

  addSubCategory() {
    if (!this.selectedParentCategory) {
      alert('Please select a parent category');
      return;
    }
    if (!this.subCategoryName.trim()) {
      alert('Please enter a subcategory name');
      return;
    }
    // Save the subcategory (mock implementation)
    console.log('Added Subcategory:', {
      parentCategory: this.selectedParentCategory,
      name: this.subCategoryName,
    });
    this.subCategoryName = '';
    alert('Subcategory added successfully!');
  }
}
