import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  basePath = 'assets/images/';
  slides = [
    { name: 'fruit.jpg', alt: 'fruits' },
    { name: 'vegetables.jpg', alt: 'vegitables' },
    { name: 'allcombination.jpg', alt: 'allcombination' },
    { name: 'camera.jpg', alt: 'camera' },
    {
      name: 'watch.jpg',
      alt: 'watch',
    },
  ];

  getImagePath(imageName: string): string {
    console.log('path', this.basePath + imageName);
    return this.basePath + imageName;
  }
}
