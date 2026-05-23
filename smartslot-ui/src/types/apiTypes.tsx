export interface BusinessDto {
  id: string;
  name: string;
  businessType: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  openingTime: string;
  closingTime: string;
}

export interface OfferResponseDto {
  id: string;
  businessId: string;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  offerPrice: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  termsAndConditions: string;
  status: string;
}

export interface SlotResponseDto {
  id: string;
  offerId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  status: string;
}

export interface BookingResponseDto {
  id: string;
  bookingReference: string;
  offerId: string;
  slotId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  peopleCount: number;
  specialNote?: string;
  status: string;
  createdAt: string;
}
