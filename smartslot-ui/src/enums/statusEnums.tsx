// Offer Status
export const OfferStatus = {
  Draft: 'Draft',
  Active: 'Active',
  Paused: 'Paused',
  Expired: 'Expired',
  Cancelled: 'Cancelled'
} as const;

export type OfferStatus = typeof OfferStatus[keyof typeof OfferStatus];

// Slot Status
export const SlotStatus = {
  Available: 'Available',
  Full: 'Full',
  Closed: 'Closed',
  Expired: 'Expired',
  Cancelled: 'Cancelled'
} as const;

export type SlotStatus = typeof SlotStatus[keyof typeof SlotStatus];

// Booking Status
export const BookingStatus = {
  Pending: 'Pending',
  Confirmed: 'Confirmed',
  Cancelled: 'Cancelled',
  Completed: 'Completed',
  NoShow: 'NoShow'
} as const;

export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];
