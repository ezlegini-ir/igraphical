"use server";

import { Course, User } from "@igraph/database";
import axios, { AxiosError } from "axios";

async function login() {
  try {
    const loginToDigipay = (await axios.post(
      "https://api.mydigipay.com/digipay/api/oauth/token",
      new URLSearchParams({
        username: process.env.DIGIPAY_USERNAME!,
        password: process.env.DIGIPAY_PASSWORD!,
        grant_type: "password",
      }),
      {
        headers: {
          Authorization: process.env.DIGIPAY_AUTHORIZATION,
        },
      }
    )) as {
      data: {
        access_token: string;
        token_type: string;
        refresh_token: string;
        expires_in: number;
        scope: string;
        jti: string;
      };
    };

    return loginToDigipay;
  } catch (error) {
    console.error(error);
  }
}

export async function InitiateDigipayPurchase(
  user: User,
  amount: number,
  paymentId: number,
  courses: Course[]
) {
  try {
    const loginToDigipay = await login();

    const newTicket = (await axios.post(
      "https://api.mydigipay.com/digipay/api/tickets/business?type=11",
      {
        cellNumber: user.phone,
        amount: amount * 10,
        providerId: paymentId,
        callbackUrl: `${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BASE_URL
            : "http://localhost:3000"
        }/api/digipay?paymentMethod=DIGIPAY`,
        basketDetailsDto: {
          items: courses.map((c) => ({
            sellerId: process.env.DIGIPAY_USERNAME,
            supplierId: process.env.DIGIPAY_USERNAME,
            productCode: c.id,
            brand: c.categoryId,
            productType: 3,
            count: 1,
            categoryId: c.categoryId,
          })),
          basketId: paymentId,
        },
      },
      {
        headers: {
          Agent: "WEB",
          "Digipay-Version": "2022-02-02",
          Authorization: `Bearer ${loginToDigipay?.data.access_token}`,
          "Content-Type": "application/json",
        },
      }
    )) as {
      data: {
        result: {
          status: number;
          message: string;
          level: string;
        };
        ticket: string;
        redirectUrl: string;
      };
    };

    return {
      success: "Payment Initiated Successfully",
      data: {
        paymentUrl: newTicket.data.redirectUrl,
        authority: newTicket.data.ticket,
      },
    };
  } catch (error) {
    console.log(error as AxiosError);
    return { error: "Payment initiation failed:" + error };
  }
}

export async function verifyDigipayPurchase(
  trackingCode: string,
  providerId: string,
  status: "OK" | "NOK"
) {
  if (!trackingCode || !providerId)
    return { error: "trackingCode and providerId is needed" };

  try {
    const loginToDigipay = await login();

    const res = await axios.post(
      "https://api.mydigipay.com/digipay/api/purchases/verify?type=13",
      {
        trackingCode,
        providerId,
      },
      {
        headers: {
          Authorization: `Bearer ${loginToDigipay?.data.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (status === "NOK") return { error: "Payment Unsuccessfull" };

    if (res.data.result.status === 0) {
      return { success: "Payment Successfull", data: res.data };
    } else {
      return {
        error: "Payment failed with code: " + res.data.code,
      };
    }
  } catch (error) {
    console.error(error);
    return { error: String(error) };
  }
}
