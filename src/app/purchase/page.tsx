import { Metadata } from "next";
import { EmailLoginForm } from "@/components/purchase/email-login-form";
import { getTicketDetails } from "@/actions/actions";
import { getCookie } from "cookies-next";
import { useUserContext } from "@/store/UserContext";

export const metadata: Metadata = {
  title: "Blessed.fan | Buy a ticket"
};

export default async function PurchasePage() {
  // const accessToken = getCookie("bouncerToken");
  // console.log("🫠 accessToken: ", accessToken)
  // const ticketDetails = await getTicketDetails(accessToken);
  //
  // console.log("🔮 ticketDetails: ", ticketDetails)

  return (
    <div>
      <EmailLoginForm />
    </div>
  );
}
