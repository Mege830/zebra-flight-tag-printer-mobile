import { create } from 'zustand';
import axios from 'axios';
import { apiClient } from '@/utils/axios';
import type { ApiResponse } from '@/types/api';
import { FlightSummary } from '@/types/flightSummary';

interface FlightsState {
  flights: FlightSummary[];
  loading: boolean;
  error: string | null;
  fetchFlights: () => Promise<void>;
}

export const useFlightsStore = create<FlightsState>((set) => ({
  flights: [],
  loading: true,
  error: null,

  fetchFlights: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get<ApiResponse<FlightSummary[]>>('/api/get_flights');
      set({ flights: response.data.data, loading: false });
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Uçuşlar yüklenemedi.'
        : 'Beklenmeyen bir hata oluştu.';
      set({ error: message, loading: false });
    }
  },
}));