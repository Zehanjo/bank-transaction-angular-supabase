import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CurrencyType } from 'src/app/models/CurrencyType';
import { ExchangeRate, ExchangeRateOrigin } from 'src/app/models/ExchangeRate';
import { Transactions, TransactionsOrigin } from 'src/app/models/Transactions';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { TransactionService } from 'src/app/services/transaction.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  exchangeRate: ExchangeRate = new ExchangeRate();
  AddExchangeRate: ExchangeRateOrigin = new ExchangeRateOrigin();
  TestAddExchangeRate: TransactionsOrigin = new TransactionsOrigin();
  loadTransaction: Transactions = new Transactions();
  transactionUpdate: TransactionsOrigin = new TransactionsOrigin();
  newTransaction: TransactionsOrigin = new TransactionsOrigin();
  uploadTransactions: TransactionsOrigin[] = [];
  listTransactions: Transactions[] = [];
  currencyList: CurrencyType[] = [];
  currency: any = [];
  file: any = [];
  data: any = [];
  balance_total: number = 0;
  p: number = 0;
  switchValue: boolean = false;
  selectedCurrencyId: number = -1;
  load: string = '1';
  constructor(
    private httpClient: HttpClient,
    private service: TransactionService,
    private exchangeRateService: ExchangeRateService
  ) {}
  async ngOnInit() {
    await this.getAllTransactions().then(() => {
      this.balanceTotalSum();
    });
    console.log(this.listTransactions);

    const valorGuardado = localStorage.getItem('switchApi');
    if (valorGuardado !== null) {
      this.switchValue = JSON.parse(valorGuardado);
      console.log(this.switchValue);
    }
  }

  loadTransactions(transaction: Transactions) {
    this.loadTransaction = transaction;
    this.fillSelectionCurrency();
  }

  selectionCurrency(event: any) {
    this.selectedCurrencyId = event.target.value;
    console.log(this.selectedCurrencyId);
  }

  async fillSelectionCurrency() {
    this.currencyList = await this.service.getAllTypeCurrency();
  }

  async getAllTransactions() {
    const response = await this.service.getTransactions();
    this.listTransactions = response;
  }

  async transactionEdit() {
    this.transactionUpdate.amount = this.loadTransaction.amount;
    this.transactionUpdate.description = this.loadTransaction.description;
    this.transactionUpdate.code_unique = this.loadTransaction.code_unique;
    this.transactionUpdate.date = this.loadTransaction.date;
    console.log(this.loadTransaction.currency);
    if ((this.selectedCurrencyId = -1)) {
      let data = await this.getTypeCurrency(this.loadTransaction.currency);
      this.transactionUpdate.id_type_currency = this.data.id;
    } else {
      this.transactionUpdate.id_type_currency = this.selectedCurrencyId;
    }

    console.log(this.loadTransaction.id, 'id');

    let response = await this.service.updateTransactionOne(
      this.transactionUpdate,
      this.loadTransaction.id
    );
    if (response) {
      Swal.fire({
        icon: 'success',
        title: ' Registro Actualizado Correctamente',
        showConfirmButton: false,
        timer: 2000,
      });
    }

    this.ngOnInit();
  }

  async transactionAdd(){
    this.newTransaction.id_type_currency = this.selectedCurrencyId;
    let cadena:string = this.newTransaction.date.toISOString();
    console.log("data",this.newTransaction,cadena.length);
    // let response = await this.service.addBankTransactions(this.newTransaction);
    // if (response) {
    //   Swal.fire({
    //     icon: 'success',
    //     title: ' Registrado Correctamente',
    //     showConfirmButton: false,
    //     timer: 2000,
    //   });
    // }
  }

  async deleteTransaction() {
    console.log(this.loadTransaction);

    let response = await this.service.deleteTransaction(
      this.loadTransaction.id
    );
    if ((response.status = 200)) {
      Swal.fire({
        icon: 'success',
        title: ' Registro Eliminado Correctamente',
        showConfirmButton: false,
        timer: 2000,
      });
    }
    this.ngOnInit();
  }

  getExchangeRateSunatandInsert() {
    this.exchangeRateService.getExchangeRateSunat().subscribe(async (data) => {
      // const response = await this.service.getTypeCurrencyById(data.moneda);
      const response = await this.getTypeCurrency(data.moneda);
      this.AddExchangeRate.compra = data.compra;
      this.AddExchangeRate.venta = data.venta;
      this.AddExchangeRate.origen = data.origen;
      this.AddExchangeRate.fecha = data.fecha;
      this.AddExchangeRate.id_type_currency = response.id;
      const result = this.exchangeRateService.postExchangeRate(
        this.AddExchangeRate
      );
      console.log(result);
    });
  }

  async getExchangeRate() {
    let date = this.formatedDate();
    const response = await this.exchangeRateService.getExchangeRateById(date);
    this.exchangeRate = response[0];
    if (this.exchangeRate) {
      // console.log(this.exchangeRate.compra);
    } else {
      this.getExchangeRateSunatandInsert();
      console.log('no hya data');
    }
  }

  formatedDate() {
    let date: Date = new Date();
    const format = 'yyyy-MM-dd';
    const locale = 'en-US';
    const formattedDate = formatDate(date, format, locale);
    console.log('Date = ' + formattedDate);
    return formattedDate;
  }

  async getTypeCurrency(moneda: string) {
    const response = await this.service.getTypeCurrencyById(moneda);
    console.log('response', response);

    return response[0];
  }

  //////////////////////////////////////////////////////// File

  uploadData() {
    if (this.data.length) {
      this.loadData();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Seleccion un archivo',
      });
    }
  }
  buys: number = -1;
  async loadData() {
    if (this.switchValue) {
      let response = this.switchApiSunat();
      let dataDate = await this.exchangeRateService.getByDateExchangeRateJSON(
        response
      );
      if (dataDate.length > 0) {
        this.buys = dataDate[0].compra;
        this.load = '2';
        this.loadData_2();
      } else {
        Swal.fire({
          icon: 'info',
          title: 'No se encontraron Registro para el tipo de cambio de Hoy',
          text: 'Por favor, registre la compra en el Tipo de Cambio',
        });
      }
      console.log('dataDate', dataDate);
    } else {
      this.loadData_2();
    }
  }

  async loadData_2() {
    this.load = '2';
    this.uploadTransactions = [];
    let not_unique: boolean = false;
    let code_unique_repeat = [];
    let compra;
    console.log(this.data);

    for (let index = 0; index < this.data.length; index++) {
      const data = this.data[index];
      for (let i = 0; i < this.listTransactions.length; i++) {
        const element = this.listTransactions[i];
        if (data.codigo_unico.toString() === element.code_unique) {
          not_unique = true;
          code_unique_repeat.push(element.code_unique);
          break;
        }
        not_unique = false;
      }
      if (!not_unique) {
        console.log('es true?', data.codigo_unico);
        if (data.moneda == 'USD') {
          await this.getExchangeRate();
          if (this.switchValue) {
            compra = this.buys;
          } else {
            compra = this.exchangeRate.compra;
          }
          let currency2 = compra * data.monto;
          let amountFloat = parseFloat(currency2.toFixed(2));
          data.monto = amountFloat;
        }
        const transaction = {
          date: data.fecha.toLocaleString(),
          description: data.descripcion,
          amount: data.monto,
          code_unique: data.codigo_unico,
          id_type_currency: 2,
        };
        this.uploadTransactions.push(transaction);

        let response = await this.service.addBankTransactions(transaction);
        if (response) {
          if (this.data.length - 1 == index) {
            Swal.fire({
              icon: 'success',
              title: this.data.length + ' Registros Guardados Correctamente',
              showConfirmButton: false,
              timer: 2000,
            });
          }
        }
      } else {
        if (this.data.length - 1 == index) {
          let nro = index + 1;
          console.log('hola', this.data.length);
          Swal.fire({
            icon: 'info',
            title:
              code_unique_repeat.length +
              ' de ' +
              nro +
              ' registros no fueron agregados',
            text:
              'Datos no registrados - codigo repetido: ' + code_unique_repeat,
          });
        }
      }
    }
    this.load = '1';
    this.ngOnInit();
  }

  async selectFile(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      if (this.file.type == 'text/csv') {
        this.uploadCSVFile(event);
      } else if (this.file.type == 'application/json') {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const jsonData = e.target?.result as string;
            const updatedJsonContent = jsonData.replace(/'/g, '"');
            try {
              const parsedData = JSON.parse(updatedJsonContent);
              this.data = parsedData;
            } catch (error) {
              console.error('Error parsing JSON:', error);
            }
          };

          reader.readAsText(file);
        }
      } else {
        this.data = [];
        Swal.fire({
          icon: 'error',
          title: 'Archivo no valido',
          text: 'Solo archivos permitidos como .csv o .json',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Seleccion un archivo',
      });
    }
  }

  uploadCSVFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const csvData = e.target?.result as string;
        const jsonData = this.convertCSVToJson(csvData);
        console.log('jsonData', jsonData);
        this.data = jsonData;
      };

      reader.readAsText(file, 'ISO-8859-1'); // Use ISO-8859-1 encoding
    }
  }

  convertCSVToJson(csvData: string): any[] {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const jsonData: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');

      if (values.length !== headers.length) {
        continue; // Skip incomplete or mismatched lines
      }

      const entry: any = {};

      for (let j = 0; j < headers.length; j++) {
        const header = headers[j].trim();
        const value = values[j]?.trim() || ''; // Default to empty string if value is undefined

        if (header === 'fecha') {
          entry[header] = value; // Mantener la fecha como string
        } else {
          entry[header] = value; // Mantener los caracteres con tilde
        }
      }

      jsonData.push(entry);
    }

    return jsonData;
  }
  balanceTotalSum() {
    this.listTransactions.forEach((element) => {
      this.balance_total = this.balance_total + element.amount;
      this.p = this.p + 1;
    });
    console.log(this.p);
  }

  switchApiSunat() {
    let date = this.getFecha();
    console.log(this.switchValue, date);
    localStorage.setItem('switchApi', JSON.stringify(this.switchValue));
    return date;
  }

  getFecha() {
    const today = new Date();

    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    const fechaEnFormatoISO = `${year}-${month}-${day}`;
    return fechaEnFormatoISO;
  }
}
