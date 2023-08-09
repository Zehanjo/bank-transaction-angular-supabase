import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { ExchangeRateComponent } from './exchange-rate/exchange-rate.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionsComponent
  },
  {
    path: 'tipo-cambio',
    component: ExchangeRateComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
