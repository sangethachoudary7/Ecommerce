import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  ngOnInit() {
    console.log('ContactComponent loaded!');
  }
  openMap() {
    const address = 'Josef Frankel Straße 9c, Berlin';
    const url = `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  }
}
