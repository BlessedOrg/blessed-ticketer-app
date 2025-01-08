"use client";
import StripeCheckoutButton from "@/components/purchase/stripe-checkout";
import CardWrapper from "@/components/card-wrapper";
import { useUserContext } from "@/store/UserContext";
import { AuthModal } from "@/components/navigation/authModal/AuthModal";
import { getCookie } from "cookies-next";
import { getTicketDetails } from "@/actions/actions";
import { useEffect, useState } from "react";
import { FixedLoading } from "@/components/ui/fixed-loading";

export function EmailLoginForm() {
  const { isLoggedIn, id } = useUserContext();
  const [ticketDetails, setTicketDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const accessToken = getCookie("bouncerToken");
        if (!accessToken) {
          throw new Error("No access token found");
        }
        const ticketDetails = await getTicketDetails(accessToken);
        setTicketDetails(ticketDetails);
      } catch (err) {
        console.error("🚨Error fetching ticket details:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, []);

  const title = isLoggedIn && !loading && ticketDetails !== null
    ? `Buy a ticket for ${ticketDetails?.Event?.name}`
    : error
      ? `Error occurred. Please, contact the admin and check below for the details.`
      : null
  const description = isLoggedIn && !loading && ticketDetails !== null
    ? "After clicking button bellow you will be redirected to the payment provider."
    : error
      ? error
      : null;

  if (!isLoggedIn) {
    return <AuthModal />
  }

  if (loading) {
    return <FixedLoading />
  }

  return (
    <CardWrapper title={title} description={description}>
      {!loading && ticketDetails !== null
        ? <StripeCheckoutButton userId={id!} ticketId={ticketDetails?.id} eventId={ticketDetails?.eventId} />
        : null
      }
    </CardWrapper>
  );
}