"use client";
import StripeCheckoutButton from "@/components/purchase/stripe-checkout";
import CardWrapper from "@/components/card-wrapper";
import { fetcherWithToken } from "@/requests/requests";
import { apiUrl } from "@/variables/varaibles";
import useSWR from "swr";
import { useUserContext } from "@/store/UserContext";
import { AuthModal } from "@/components/navigation/authModal/AuthModal";

export function EmailLoginForm() {
  const { isLoggedIn, id } = useUserContext();

  const ticketId = "cm4u5xrsg000baefio36tbdb2";
  const eventId = "cm4u5xhkq0001aefirdngla1m";

  const { data: ticketDetails } = useSWR(`${apiUrl}/private/tickets/${eventId}/${ticketId}/purchase-details`, fetcherWithToken);

  const title = `Buy a ticket for ${ticketDetails?.Event?.name}`;
  const description = isLoggedIn
    ? "After clicking button bellow you will be redirected to the payment provider."
    : "";

  return (
    <CardWrapper title={title} description={description}>
      {!isLoggedIn ? (
        <>
          <AuthModal />
        </>
      ) : (
        <StripeCheckoutButton userId={id!} ticketId={ticketDetails?.id} eventId={ticketDetails?.eventId} />
      )}
    </CardWrapper>
  );
}