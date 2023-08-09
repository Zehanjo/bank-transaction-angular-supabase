import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.development';
import { ExchangeRate, ExchangeRateJSON } from '../models/ExchangeRate';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  url = 'https://exchange-rate.up.railway.app/';
  private supabase:SupabaseClient
  constructor(private http: HttpClient) {
    this.supabase = createClient(environment.supabaseUrl,environment.supabaseKey);
  }

  async getAllExchangeRateJSON(){
    const response = await this.supabase.rpc('getexchangeratejson');
    return response.data || [];
  }
  async getByIDExchangeRateJSON(id:number){
    const response = await this.supabase.from('EXCHANGE_RATE_JSON').select('*').eq('id',id);
    return response.data || [];
  }
  async getByDateExchangeRateJSON(date:any){
    console.log("date service",date);
    const response = await this.supabase.from('EXCHANGE_RATE_JSON').select('*').eq('fecha',date);
    return response.data || [];
  }
  async addExchangeRateJSON(data:ExchangeRateJSON){
    const response = await this.supabase.from('EXCHANGE_RATE_JSON').insert(data).select('*');
    return response.data || [];
  }
  async updateExchangeRateJSON(data:ExchangeRateJSON,id:number){
    const response = await this.supabase.from('EXCHANGE_RATE_JSON').update(data).eq('id', id).select();;
    return response.data || [];
  }
  async deleteExchangeRateJSON(id:number){
    const response = await this.supabase.from('EXCHANGE_RATE_JSON').delete().eq('id',id);
    return response || [];
  }



  // Exchange Rate


  async postExchangeRate(newExchangeRate:ExchangeRate){
    console.log("estamos en agregar exchange rate",newExchangeRate);
    const response = await this.supabase.from("EXCHANGE_RATE").insert(newExchangeRate).select();
    return response.data || [];
  }

  async getExchangeRateById(date:string){
    const response = await this.supabase.from('EXCHANGE_RATE').select('*').eq('fecha', date)
    return response.data || [];
  }
  async getAllExchangeRate(){
    const response = await this.supabase.from('EXCHANGE_RATE').select('*')
    return response.data || [];
  }

  getExchangeRateSunat():Observable<ExchangeRate>{
    return this.http.get<ExchangeRate>(this.url+"tipo-cambio");
  }
}
