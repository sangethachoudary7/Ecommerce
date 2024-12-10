import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.css',
})
export class WelcomePageComponent {
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([`welcome/${route}`]); // Navigates to 'welcome/<route>'
  }
  navigateToLogin() {
    this.router.navigate(['/login']); // This will redirect to the login page
  }
}
