import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { TransactionsComponent } from './transactions/transactions.component';
import { LayoutModule } from '../layout/layout.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from "@angular/forms";
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { TransactionService } from '../services/transaction.service';
import { ExchangeRateService } from '../services/exchange-rate.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ExchangeRateComponent } from './exchange-rate/exchange-rate.component';


@NgModule({
  declarations: [
    TransactionsComponent,
    ExchangeRateComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    PagesRoutingModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSlideToggleModule,
    HttpClientModule,
    MatPaginatorModule
  ],
  providers:[TransactionService,ExchangeRateService],
  exports: []
})
export class PagesModule { }
