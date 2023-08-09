export class ExchangeRate {
  compra!: number;
  venta!: number;
  origen!: string;
  moneda!: string;
  fecha!: Date;
}

export class ExchangeRateOrigin {
  compra!: number;
  venta!: number;
  origen!: string;
  moneda!: string;
  fecha!: Date;
  id_type_currency!: number;
}

export class ExchangeRateJSON {
  id!: number;
  fecha!: Date;
  venta!: number;
  compra!: number;
}
