import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { DefaultComponent } from './default/default.component';
import { MatToolbarModule } from '@angular/material/toolbar';
@NgModule({
  declarations: [HeaderComponent, DefaultComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
  ],
  exports: [HeaderComponent, DefaultComponent],
})
export class LayoutModule {}
