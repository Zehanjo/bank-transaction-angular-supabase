import { Component, OnInit } from '@angular/core';
import { ExchangeRateJSON } from 'src/app/models/ExchangeRate';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.scss'],
})
export class ExchangeRateComponent implements OnInit {
  listExchangeRateJSON: ExchangeRateJSON[] = [];
  loadExchangeRateJSON: ExchangeRateJSON = new ExchangeRateJSON();
  constructor(private serviceExchangeRate: ExchangeRateService) {}
  async ngOnInit() {
    await this.getAllExchangeRateJSON();
  }

  async getAllExchangeRateJSON() {
    this.listExchangeRateJSON =
      await this.serviceExchangeRate.getAllExchangeRateJSON();
  }

  async exchangeRateEdit() {
    console.log('edit',this.loadExchangeRateJSON.fecha);
    const verify = await this.serviceExchangeRate.getByDateExchangeRateJSON(
      this.loadExchangeRateJSON.fecha
    );
    console.log('verify', verify);
    if(verify){
      if (verify[0].fecha === this.loadExchangeRateJSON.fecha) {
        if ((verify[0].id === this.loadExchangeRateJSON.id)) {
          const response = await this.serviceExchangeRate.updateExchangeRateJSON(this.loadExchangeRateJSON,this.loadExchangeRateJSON.id);
          console.log(response);
          if (response) {
            Swal.fire({
              icon: 'success',
              title:' Registro Actualizado Correctamente',
              showConfirmButton: false,
              timer: 2000,
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title:'No se pudo actualizar el registro',
            text:'No se puede repetir una fecha registrada'
          });
        }
      } else {
        console.log('no se puede modificar');
      }
    }

    this.ngOnInit();
  }

  async deleteExchangeRate() {
    const response = await this.serviceExchangeRate.deleteExchangeRateJSON(
      this.loadExchangeRateJSON.id
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

  // Aditioinal

  loadExchangeRate(exchangeRate: ExchangeRateJSON) {
    this.loadExchangeRateJSON = exchangeRate;
  }
}
