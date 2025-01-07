"use server";

import { apiUrl, eventId, ticketId } from "@/variables/envVariables";

export const getTicketDetails = async (accessToken: string) => {
  const url = `${apiUrl}/private/tickets/${eventId}/${ticketId}/purchase-details`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    }
  }).then((res: Response) => res.json());
  if (res?.error || res?.statusCode >= 400) {
    throw new Error(res.message, { cause: res.error });
  }
  return res;
};