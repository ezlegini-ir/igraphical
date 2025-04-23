import Kavenegar from "kavenegar";

export const kavenegar = Kavenegar.KavenegarApi({
  apikey: process.env.KAVENEGAR_API!,
});
