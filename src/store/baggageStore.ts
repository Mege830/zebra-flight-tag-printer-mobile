import { create } from 'zustand';
import axios from 'axios';
import { apiClient } from '@/utils/axios';
import type { ApiResponse } from '@/types/api';
import type { BaggageDetailResponse } from '@/types/baggage';
import { printZpl } from '@/lib/printer';
import { ensurePrinterConnected } from '@/lib/printer';

interface BaggageState {
  detail: BaggageDetailResponse | null;
  loading: boolean;
  error: string | null;
  zplData: string | null;
  barcodeLoading: boolean;
  barcodeError: string | null;
  printLoading: boolean;
  printError: string | null;
  fetchBaggageDetail: (flightId: string) => Promise<void>;
  printBarcode: () => Promise<void>;
  reset: () => void;
}

export const useBaggageStore = create<BaggageState>((set, get) => ({
  detail: null,
  loading: false,
  error: null,
  zplData: null,
  barcodeLoading: false,
  barcodeError: null,
  printLoading: false,
  printError: null,

  fetchBaggageDetail: async (flightId: string) => {
    set({ loading: true, error: null, barcodeError: null });

    try {
      /* Orijinal API Çağrısı (Geçici olarak yoruma alındı)
      const response = await apiClient.get<ApiResponse<BaggageDetailResponse>>(
        `/api/get_baggage_detail/${flightId}`
      );
      set({ detail: response.data.data, loading: false });
      */

      // Mock (Sahte) Veri
      // Not: Mevcut BaggageDetailResponse tipinde Yolcu Adı, PNR ve Varış Noktası alanları olmadığı için
      // tip hatası (TS error) almamak adına interface'e tam uyan alanlar kullanıldı.
      const mockData: BaggageDetailResponse = {
        baggage_id: '0123456789', // İstenilen Bagaj/Etiket No
        flightId: 'HITIT1', // PNR bilgisini uçuş ID yerine kullanıyoruz
        flightNumber: 'TK1234', // İstenilen Uçuş Numarası
        airline: 'Turkish Airlines',
        baggagePolicy: {
          cabinBaggageAllowance: '8 kg',
          checkedBaggageAllowance: '20 kg',
          extraFeePerKg: '50 TRY',
          specialRules: 'Yolcu: Murat Ege Serbest | Varış: PRG', // TS tipinde olmadığı için ekstra verileri buraya ekledik
        }
      };

      // API gecikmesini simüle edelim
      await new Promise(resolve => setTimeout(resolve, 500));

      set({ detail: mockData, loading: false });
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Detaylar yüklenemedi.'
        : 'Beklenmeyen bir hata oluştu.';

      set({ error: message, loading: false });
    }
  },

  printBarcode: async () => {
    const baggageId = get().detail?.baggage_id;
    const flightId = get().detail?.flightId;

    if (!baggageId || !flightId) {
      set({ printError: 'Bagaj veya uçuş detayı bulunamadı.' });
      return;
    }

    set({ printLoading: true, printError: null });

    try {
      // 1. Backend'den ZPL string'ini al (POST) - GECICI OLARAK MOCKLANDI
      /*
      const response = await apiClient.post<ApiResponse<{ zpl: string }>>(
        `/api/flights/${flightId}/baggage-tags/${baggageId}/print`
      );

      const zplString = response.data.data?.zpl;
      if (!zplString) {
        throw new Error('ZPL string alınamadı.');
      }
      */
      
      // Mock ZPL Verisi
      // Bu ZPL, standart bir bagaj etiketi basmak için test komutları içerir.
      const zplString = `^XA
^FO50,50^ADN,36,20^FDYolcu: Murat Ege Serbest^FS
^FO50,100^ADN,36,20^FDUcus: TK1234^FS
^FO50,150^ADN,36,20^FDVaris: PRG^FS
^FO50,200^BCN,100,Y,N,N^FD0123456789^FS
^XZ`;

      set({ zplData: zplString });

      // 2. Yazıcıya bağlan
      const connected = await ensurePrinterConnected('90:75:DE:18:2C:C3');
      if (!connected) {
        throw new Error('Yazıcıya bağlanılamadı.');
      }

      // 3. Yazdır
      await printZpl(zplString);
      set({ printLoading: false });
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Yazdırma sırasında hata oluştu.'
        : err instanceof Error ? err.message : 'Beklenmeyen bir hata oluştu.';
      
      set({ printError: message, printLoading: false });
    }
  },

  reset: () => set({
    detail: null,
    loading: false,
    error: null,
    zplData: null,
    barcodeLoading: false,
    barcodeError: null,
    printLoading: false,
    printError: null,
  }), 
}));