export interface BusinessDto {
  id: string;
  name: string;
  businessType: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
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
  startTime: string;
  endTime: string;
  capacity: number;
  isAvailable: boolean;
}

export interface CreateSlotDto {
  offerId: string;
  startTime: string;
  endTime: string;
  capacity: number;
}

export interface BookingResponseDto {
  id: string;
  bookingReference: string;
  customerName: string;
  customerPhone: string;
  peopleCount: number;
  status: string;
  createdAt: string;
}

export interface CreateBookingDto {
  offerId: string;
  slotId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  peopleCount: number;
  specialNote?: string;
}

export interface DashboardSummaryDto {
  totalBusinesses: number;
  totalOffers: number;
  totalSlots: number;
  totalBookings: number;
  totalRevenue: number;
  activeOffers: number;
  occupancyRate: number;
}

export interface RecentBookingDto {
  bookingReference: string;
  customerName: string;
  offerTitle: string;
  peopleCount: number;
  createdAt: string;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface LoginResponseDto {
  token: string;
  email: string;
  role: string;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateBookingStatusDto {
  status: string;
}

export interface CustomerBookingDto {
  id: string;
  bookingReference: string;
  offerId: string;
  offerTitle: string;
  offerPrice: number;
  slotStartTime: string;
  slotEndTime: string;
  customerName: string;
  customerPhone: string;
  peopleCount: number;
  status: string;
  createdAt: string;
}

export interface PublicBookingTrackerDto {
  bookingReference: string;
  offerTitle: string;
  slotStartTime: string;
  slotEndTime: string;
  customerName: string;
  maskedPhone: string;
  peopleCount: number;
  status: string;
  createdAt: string;
}

export interface RevenueAnalyticsDto {
  offerTitle: string;
  totalBookings: number;
  revenue: number;
}
