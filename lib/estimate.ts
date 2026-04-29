type Params = { carModel: string; modelCode: string; needLoanerCar: boolean };

export function calcEstimateYen({ carModel, modelCode, needLoanerCar }: Params): number {
  let base = 55000;
  if (/suv|van|ミニバン/i.test(carModel)) base += 12000;
  if (/軽|kei/i.test(carModel)) base -= 8000;
  if (modelCode.length > 5) base += 2000;
  if (needLoanerCar) base += 3000;
  return base;
}
