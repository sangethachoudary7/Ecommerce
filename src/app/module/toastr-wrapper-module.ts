import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      timeOut: 3000,
    }),
  ],
  exports: [ToastrModule],
})
export class ToastrWrapperModule {}
