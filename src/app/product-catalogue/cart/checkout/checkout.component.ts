import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  currentStep: number = 0;
  steps: string[] = ['Confirm', 'Address', 'Payment', 'Complete'];
  stateMax: number = this.steps.length - 1;

  constructor(private router: Router) {}

  get progress(): number {
    return (this.currentStep / this.stateMax) * 100;
  }

  goNext() {
    if (this.currentStep < this.stateMax) {
      this.currentStep++;

      this.enableBackButton();

      this.updateNodeClass();

      this.updateProgressBar();

      if (this.currentStep === this.stateMax) {
        this.disableNextButton();
      }

      this.navigateStep();
    }
  }

  goBack() {
    if (this.currentStep > 0) {
      console.log('Back', this.currentStep);

      this.currentStep--;

      this.enableNextButton();

      this.updateNodeClass(true);

      this.updateProgressBar();

      if (this.currentStep === 0) {
        this.disableBackButton();
      }

      this.navigateStep();
    }
  }

  private enableBackButton() {
    const backButton = document.getElementById('back');
    if (backButton) {
      backButton.classList.remove('disabled');
    }
  }

  private enableNextButton() {
    const nextButton = document.getElementById('next');
    if (nextButton) {
      nextButton.classList.remove('disabled');
    }
  }

  private disableNextButton() {
    const nextButton = document.getElementById('next');
    if (nextButton) {
      nextButton.classList.add('disabled');
    }
  }

  private disableBackButton() {
    const backButton = document.getElementById('back');
    if (backButton) {
      backButton.classList.add('disabled');
    }
  }

  private updateProgressBar() {
    const progressBar = document.querySelector('.pBar') as HTMLElement;
    if (progressBar) {
      progressBar.style.width = `${this.progress}%`;
    }
  }

  private updateNodeClass(remove: boolean = false) {

    const currentStepNodes = document.querySelectorAll(`.nConfirm${this.currentStep}`);
    const nextStepNodes = document.querySelectorAll(`.nConfirm${this.currentStep + 1}`);
    if (remove) {
         nextStepNodes.forEach((node) => node.classList.remove('done'));
    } else {
      currentStepNodes.forEach((node) => node.classList.add('done'));
    }
  
  }

  private navigateStep() {
    switch (this.currentStep) {
      case 0:
        this.router.navigate(['catalogue/cart/checkout/order-summary']);
        break;
      case 1:
        this.router.navigate(['catalogue/cart/checkout/address']);
        break;
      case 2:
        this.router.navigate(['catalogue/cart/checkout/payment']);
        break;
      case 3:
        this.router.navigate(['catalogue/cart/checkout/complete']);
        break;
    }
  }
}
