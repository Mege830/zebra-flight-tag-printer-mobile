export interface FlightSummary {
  id: string;
  flightNumber: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  status: string;
  priceAmount: number;
  priceCurrency: string;
}