import Stripe from "stripe";

let stripeClient = null;

/** Cliente Stripe lazy; null si falta STRIPE_SECRET_KEY. */
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}
