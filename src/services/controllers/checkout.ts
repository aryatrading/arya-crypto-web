import { axiosShopInstance } from "../api/axiosConfig"

export const getCheckoutDetails = async () => {
    return await axiosShopInstance.get(`/checkouts/slug/${process.env.NEXT_PUBLIC_CHECKOUT_SLUG}`)
}

export const createSubscription = async () =>{
    return await axiosShopInstance.post('/order',)
}