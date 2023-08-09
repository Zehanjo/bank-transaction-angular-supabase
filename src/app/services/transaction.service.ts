import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExchangeRate } from '../models/ExchangeRate';
import { Observable } from 'rxjs';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.development';
import { Transactions, TransactionsOrigin } from '../models/Transactions';
// import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  url = 'https://exchange-rate.up.railway.app/';
  private supabase: SupabaseClient;

  constructor(private http: HttpClient) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getTransactions() {
    const response = await this.supabase.rpc('get_transactions');
    return response.data || [];
  }

  async getTypeCurrencyById(name: string) {
    const response = await this.supabase
      .from('TYPE_CURRENCY')
      .select('*')
      .eq('name', name);
    return response.data || [];
  }
  async getAllTypeCurrency() {
    const response = await this.supabase
      .from('TYPE_CURRENCY')
      .select('*')
    return response.data || [];
  }

  async updateTransactionOne(data: TransactionsOrigin, id:number){
    const response = await this.supabase.from('BANKING_TRANSACTIONS').update(data).eq('id', id).select();
    return response.data || [];
  }

  async addMultipleBankTransactions(transactions: any) {
    let { data, error } = await this.supabase.rpc(
      'insertar_transacciones',
      transactions
    );
    return data || [];
  }

  async addBankTransactions(datas: TransactionsOrigin) {
    console.log("estamos en service transaction", datas);

    const response  = await this.supabase.from('BANKING_TRANSACTIONS').insert(datas).select();

    return response.data || [];
  }

  async deleteTransaction(id:number){
    const response = await this.supabase.from('BANKING_TRANSACTIONS').delete().eq('id',id).select();
    return response || [];
  }
}
