export const getPaymentIntent = (subject:any) => {
    if (subject.object === 'invoice') {
      return subject.payment_intent
    }
    return subject.latest_invoice.payment_intent
}