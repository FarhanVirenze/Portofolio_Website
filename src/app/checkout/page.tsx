import { CheckoutPage } from "@/components/checkout-page";

type CheckoutRouteProps = {
  searchParams: Promise<{
    product?: string;
  }>;
};

export default async function CheckoutRoute({ searchParams }: CheckoutRouteProps) {
  const params = await searchParams;

  return <CheckoutPage initialProductId={params.product} />;
}
