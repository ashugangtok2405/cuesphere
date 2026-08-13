import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Payment } from "@/types/registration";

interface PaymentRow {
  id: string;
  registration_id: string;
  club_id: string;
  method: Payment["method"];
  status: Payment["status"];
  amount: number;
  payment_id: string | null;
  transaction_id: string | null;
  payment_date: string | null;
}

function fromRow(row: PaymentRow): Payment {
  return {
    id: row.id,
    registrationId: row.registration_id,
    clubId: row.club_id,
    method: row.method,
    status: row.status,
    amount: row.amount,
    paymentId: row.payment_id,
    transactionId: row.transaction_id,
    paymentDate: row.payment_date,
  };
}

function parseAmount(entryFee: string): number {
  if (entryFee.toLowerCase() === "free") return 0;
  return Number(entryFee.replace(/[^0-9]/g, "")) || 0;
}

export async function recordOnlinePayment(
  clubId: string,
  registrationId: string,
  entryFee: string
): Promise<Payment> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("payments")
    .insert({
      registration_id: registrationId,
      club_id: clubId,
      method: "online",
      status: "paid",
      amount: parseAmount(entryFee),
      payment_id: `pay_${Math.random().toString(36).slice(2, 12)}`,
      transaction_id: `txn_${Math.random().toString(36).slice(2, 14)}`,
      payment_date: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Could not record payment.");
  return fromRow(data as PaymentRow);
}

export async function recordOfflinePayment(
  clubId: string,
  registrationId: string,
  entryFee: string
): Promise<Payment> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("payments")
    .insert({
      registration_id: registrationId,
      club_id: clubId,
      method: "offline",
      status: "pending",
      amount: parseAmount(entryFee),
    })
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Could not record payment.");
  return fromRow(data as PaymentRow);
}

export async function getPaymentForRegistration(registrationId: string): Promise<Payment | undefined> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("payments")
    .select("*")
    .eq("registration_id", registrationId)
    .maybeSingle();
  return data ? fromRow(data as PaymentRow) : undefined;
}
