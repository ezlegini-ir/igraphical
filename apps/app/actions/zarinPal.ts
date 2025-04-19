"use server";

import { User } from "@igraph/database";
import ZarinPal from "zarinpal-node-sdk";

const zarinpal = new ZarinPal({
  merchantId: process.env.ZARRINPAL_MERCHANT_ID,
  sandbox: process.env.NODE_ENV !== "production",
  accessToken: process.env.ZARRINPAL_ACCESS_TOKEN,
});

export async function InitiatePurchase(
  user: User,
  amount: number,
  paymentId: number,
  query: string = ""
) {
  try {
    const response = (await zarinpal.payments.create({
      amount: amount * 10, //convert to RIAL
      callback_url: `${
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BASE_URL
          : "http://localhost:3000"
      }/checkout-result${query}`,
      description: `Payment For User ${user.id} | Payment Id: ${paymentId}`,
      mobile: user.phone,
      email: user.email,
    })) as {
      data: {
        authority: string;
        fee: number;
        fee_type: string;
        code: number;
        message: string;
      };
    };

    if (response.data && response.data.authority) {
      const paymentUrl = zarinpal.payments.getRedirectUrl(
        response.data.authority
      );

      return {
        success: "Payment Initiated Successfully",
        data: { paymentUrl, authority: response.data.authority },
      };
    } else {
      console.error("Error: Invalid response from ZarinPal", response);
      return null;
    }
  } catch (error) {
    return { error: "Payment initiation failed:" + error };
  }
}

interface VerifyResponse {
  data: {
    code: 100 | 101;
    ref_id: number;
  };
  errors: any[];
}

export async function verifyPurchase(
  authority: string,
  amount: number,
  status: "OK" | "NOK"
) {
  if (!authority || !amount) return { error: "Amount and Authory is needed" };

  try {
    const res = (await zarinpal.verifications.verify({
      amount,
      authority,
    })) as VerifyResponse;

    if (status === "NOK") return { error: "Payment Unsuccessfull" };

    if (res.data.code === 100) {
      return { success: "Payment Successfull", data: res.data };
    } else {
      return {
        error: "Payment failed with code: " + res.data.code,
      };
    }
  } catch (error) {
    return { error: String(error) };
  }
}
