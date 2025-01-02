"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { fetcherWithToken } from "@/requests/requests";
<<<<<<< HEAD:src/components/purchase/stripe-checkout.tsx
import { apiUrl } from "@/variables/envVaraibles";
=======
import { apiUrl } from "@/variables/varaibles";
>>>>>>> d77b7d564d8fc45645d751d3bdbb4bea6653cade:src/components/purchase/stripe-checkout.tsx

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