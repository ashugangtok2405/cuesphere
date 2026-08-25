"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import {
  sendFriendRequest,
  respondToFriendRequest,
  removeFriendship,
} from "@/services/friendship-service";

export async function sendFriendRequestAction(recipientUserId: string) {
  const session = await getSession();
  if (!session) return { success: false as const, error: "You must be logged in." };

  const { error } = await sendFriendRequest(session.id, recipientUserId);
  if (error) return { success: false as const, error };

  revalidatePath("/players");
  revalidatePath("/friends");
  return { success: true as const };
}

export async function respondToFriendRequestAction(friendshipId: string, accept: boolean) {
  const session = await getSession();
  if (!session) return { success: false as const, error: "You must be logged in." };

  const { error } = await respondToFriendRequest(friendshipId, session.id, accept);
  if (error) return { success: false as const, error };

  revalidatePath("/players");
  revalidatePath("/friends");
  return { success: true as const };
}

export async function removeFriendshipAction(friendshipId: string) {
  const session = await getSession();
  if (!session) return { success: false as const, error: "You must be logged in." };

  const { error } = await removeFriendship(friendshipId, session.id);
  if (error) return { success: false as const, error };

  revalidatePath("/players");
  revalidatePath("/friends");
  return { success: true as const };
}
