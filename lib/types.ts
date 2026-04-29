export type Store = { id: string; name: string; email: string };

export type Slot = {
  id: string;
  storeId: string;
  start: string;
  capacity: number;
};

export type ReservationStatus = 'tentative';

export type Reservation = {
  id: string;
  storeId: string;
  slotId: string;
  desiredDateTime: string;
  name: string;
  phone: string;
  email: string;
  carModel: string;
  modelCode: string;
  typeDesignationNumber: string;
  classificationNumber: string;
  expirationDate: string;
  needLoanerCar: boolean;
  estimateYen: number;
  status: ReservationStatus;
  createdAt: string;
};
