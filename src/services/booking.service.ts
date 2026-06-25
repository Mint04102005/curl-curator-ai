import { randomDelay } from "@/lib/delay";
import { MOCK_BOOKINGS } from "@/lib/mock-data";
import type { Booking } from "@/types";

let runtimeBookings: Booking[] = [...MOCK_BOOKINGS];

interface CreateBookingPayload {
  user_id: number;
  salon_id: number;
  booking_date: string;
  notes: string;
}

export const bookingService = {
  async create(payload: CreateBookingPayload): Promise<Booking> {
    await randomDelay(1000, 1800);
    const booking: Booking = {
      ...payload,
      booking_id: Date.now(),
      status: "P",
    };
    runtimeBookings = [booking, ...runtimeBookings];
    return booking;
  },
  async listByUser(user_id: number): Promise<Booking[]> {
    await randomDelay(300, 700);
    return runtimeBookings
      .filter((b) => b.user_id === user_id)
      .sort((a, b) => +new Date(b.booking_date) - +new Date(a.booking_date));
  },
};
