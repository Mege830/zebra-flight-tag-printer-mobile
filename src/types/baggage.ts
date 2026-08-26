export interface BaggagePolicy {
  cabinBaggageAllowance: string;
  checkedBaggageAllowance: string;
  extraFeePerKg: string;
  specialRules: string;
}

export interface BaggageDetailResponse {
  baggage_id?: string;
  flightId: string;
  flightNumber: string;
  airline: string;
  baggagePolicy: BaggagePolicy;
}

export interface BaggageAllowance {
  type: 'cabin' | 'checked';
  pieces: number;
  maxWeightKg: number;
  maxDimensionsCm: string;
}

export interface BaggageFee {
  amount: number;
  currency: string;
}