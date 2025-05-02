import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import PaymentContent from "./payment-content";

export default function PaymentPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <PaymentContent />
      <Footer />
    </div>
  );
}
