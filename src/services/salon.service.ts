import { randomDelay } from "@/lib/delay";
import { MOCK_SALONS } from "@/lib/mock-data";
import type { Salon } from "@/types";

export const salonService = {
  async search(q?: string): Promise<Salon[]> {
    await randomDelay(500, 1000);
    if (!q) return MOCK_SALONS;
    const k = q.toLowerCase();
    return MOCK_SALONS.filter(
      (s) =>
        s.salonname.toLowerCase().includes(k) ||
        s.address.toLowerCase().includes(k) ||
        s.tag.toLowerCase().includes(k),
    );
  },
  async getById(id: number): Promise<Salon | null> {
    await randomDelay(200, 500);
    return MOCK_SALONS.find((s) => s.salon_id === id) ?? null;
  },
};
