export type PaymentMethod = "online" | "offline";
export type PaymentStatus = "pending" | "paid" | "failed";
export type RegistrationStatus = "pending_approval" | "confirmed" | "cancelled";

export interface Payment {
  id: string;
  registrationId: string;
  clubId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  paymentId: string | null;
  transactionId: string | null;
  paymentDate: string | null;
}

export interface TournamentRegistration {
  id: string;
  registrationNumber: string;
  clubId: string;
  tournamentId: string;
  playerId: string;
  status: RegistrationStatus;
  emergencyContact: string;
  preferredCue: string;
  notes: string;
  agreedToRules: boolean;
  createdAt: string;
}
