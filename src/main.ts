import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

// bootstrapApplication(AppComponent, {
//   ...appConfig,
//   providers: [
//     ...appConfig.providers, // Existing providers from appConfig
//     provideAnimations(),    // Required animations providers
//     provideToastr(),        // Toastr providers
//   ],
// }).catch((err) =>
//   console.error(err)
// );
// function provideToastr(): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
//   throw new Error('Function not implemented.');
// }
