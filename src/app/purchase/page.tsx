import { Metadata } from "next";
import { EmailLoginForm } from "@/components/purchase/email-login-form";

export const metadata: Metadata = {
  title: "Blessed.fan | fund wallet"
};

export default async function PurchasePage() {
  return (
    <div>
      <EmailLoginForm />
    </div>
  );
}
