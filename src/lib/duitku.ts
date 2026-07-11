export type DuitkuInquiryResponse = {
  reference?: string;
  paymentUrl?: string;
  vaNumber?: string;
  qrString?: string;
  appUrl?: string;
  amount?: string | number;
  statusCode?: string;
  statusMessage?: string;
};

export function parseDuitkuResponse(raw: unknown): DuitkuInquiryResponse | null {
  if (!raw || typeof raw !== "object") return null;
  return raw as DuitkuInquiryResponse;
}

export function getPaymentInstructionType(paymentMethod: string) {
  if (["SP", "NQ", "GQ", "SQ"].includes(paymentMethod)) return "qris";
  if (["OV", "DA", "LA", "SA"].includes(paymentMethod)) return "ewallet";
  if (paymentMethod === "VC") return "card";
  return "virtual-account";
}
