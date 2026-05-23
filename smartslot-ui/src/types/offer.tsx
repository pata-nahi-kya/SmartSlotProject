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

export interface PaginatedResponseDto<T> {
  data: T[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}
