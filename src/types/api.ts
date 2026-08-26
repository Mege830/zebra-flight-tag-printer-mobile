export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface Price {
  amount: number;
  currency: string;
}

export interface FlightLocation {
  airportCode: string;
  city: string;
  scheduledTime: string;
  gate: string;
  terminal: string;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  aircraft: string;
  departure: FlightLocation;
  arrival: FlightLocation;
  status: string;
  price: Price;
  maxCargoCapacity?: number;
}
