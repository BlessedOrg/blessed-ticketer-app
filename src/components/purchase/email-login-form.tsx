"use client";
import StripeCheckoutButton from "@/components/purchase/stripe-checkout";
import CardWrapper from "@/components/card-wrapper";
import { fetcherWithToken } from "@/requests/requests";
import { apiUrl, eventId, ticketId } from "@/variables/envVaraibles";
import useSWR from "swr";
import { useUserContext } from "@/store/UserContext";
import { AuthModal } from "@/components/navigation/authModal/AuthModal";

export function EmailLoginForm() {
  const { isLoggedIn, id } = useUserContext();

  const { data: ticketDetails } = useSWR(`${apiUrl}/private/tickets/${eventId}/${ticketId}/purchase-details`, fetcherWithToken);

  const title = `Buy a ticket for ${ticketDetails?.Event?.name}`;
  const description = isLoggedIn
    ? "After clicking button bellow you will be redirected to the payment provider."
    : "";

  return (
    <CardWrapper title={title} description={description}>
      {!isLoggedIn ? (
        <AuthModal />
      ) : (
        ticketDetails?.id
          ? <StripeCheckoutButton userId={id!} ticketId={ticketDetails?.id} eventId={ticketDetails?.eventId} />
          : <p>Error while fetching ticket details.</p>
      )}
    </CardWrapper>
  );
}