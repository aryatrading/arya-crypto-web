import { axiosShopInstance } from "../api/axiosConfig";

export const getCheckoutDetails = async () => {
  return await axiosShopInstance.get(
    `/checkouts/slug/${process.env.NEXT_PUBLIC_CHECKOUT_SLUG||'arya-crypto-2023'}`
  );
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



