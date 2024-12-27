"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { fetcherWithToken } from "@/requests/requests";
import { apiUrl } from "@/variables/varaibles";

export default function StripeCheckoutButton({ userId, ticketId, eventId }: { userId: string, ticketId: string, eventId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const session = await fetcherWithToken(`${apiUrl}/private/tickets/checkout-session/${ticketId}`, {
        method: "POST",
        body: JSON.stringify({
          ticketId,
          userId,
          eventSlug: eventId
        })
      });

      if (session.url) {
        router.push(session.url);
      } else {
        alert("Something went wrong. Please contact the Blessed team");
      }

    } catch (error: any) {
      console.log("🚨 Error on stripe-checkout: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSubmit} disabled={loading} className="w-full">
      Pay with Stripe
    </Button>
  );
}