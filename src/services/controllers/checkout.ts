import { MODE_DEBUG } from "../../utils/constants/config";
import { axiosInstance, axiosShopInstance } from "../api/axiosConfig";

export const getCheckoutDetails = async () => {
  const checkoutSlug =
    process.env.NEXT_PUBLIC_CHECKOUT_SLUG || "arya-crypto-2023";
  return await axiosShopInstance.get(`/checkouts/slug/${checkoutSlug}`);
};

export const getInvoices = async () => {
  const { data } = await axiosShopInstance.get(`/invoices`);

  return data;
};

export const downloadInvoicePDF = async (invoiceId: string) => {
  try {
    const invoice: any = await axiosShopInstance.get(`/invoices/${invoiceId}`);
    console.log(invoice);
    window.open(invoice?.data.url, "_blank");
  } catch (error) {
    if (MODE_DEBUG) {
      console.error(error);
    }
  }
};

export const createSubscription = async (
  checkoutId: number,
  priceId: string,
  paymentMethodId: string
) => {
  return await axiosShopInstance.post("/order", {
    paymentMethodId,
    priceId,
    checkout_id: checkoutId,
    visitor: null,
    affiliate: null,
    campaign_id: null,
    fromWallet: false,
    bumps: [],
  });
};
