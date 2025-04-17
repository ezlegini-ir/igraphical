import React from "react";
import { Course, Enrollment, Payment } from "@igraph/database";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Text,
  Button,
  render,
} from "@react-email/components";

interface OtpEmailProps {
  otp: string;
}

const containerStyles = {
  backgroundColor: "#fff",
  padding: "20px",
  borderBottomLeftRadius: "10px",
  borderBottomRightRadius: "10px",
  textAlign: "center" as "left" | "center" | "right",
};
const buttonStyles = {
  backgroundColor: "#526eff",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: "5px",
  textDecoration: "none",
  textAlign: "center" as "left" | "center" | "right",
  fontSize: "16px",
};

const linkStyles = {
  fontSize: "14px",
  display: "block",
  marginTop: "10px",
  textAlign: "center" as "left" | "center" | "right",
  color: "#526eff",
  textDecoration: "none",
};

const bodyStyles = {
  fontFamily: "Tahoma, sans-serif",
  backgroundColor: "#f9f9f9",
  padding: "20px",
};

const Header = () => {
  return (
    <Container
      style={{
        backgroundColor: "#526eff",
        padding: "20px",
        paddingTop: "27px",
        paddingBottom: "27px",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        textAlign: "center",
      }}
    >
      <Img
        src="https://dl.igraphical.ir/assets/igraph-logo.png"
        alt="آی‌گرافیکال"
        width="135"
        height="auto"
        style={{ display: "inline-block" }}
      />
    </Container>
  );
};

//! ----------------------------------------------------------

const OtpEmail = ({ otp }: OtpEmailProps) => {
  return (
    <Html lang="fa" dir="rtl">
      <Head />
      <Preview>🔒 کد تایید شما: {otp}</Preview>
      <Body style={bodyStyles}>
        <Header />

        <Container style={containerStyles}>
          <Text style={{ fontSize: "18px", color: "#333", direction: "rtl" }}>
            🔒 کد تایید شما:
          </Text>
          <Text
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              direction: "ltr",
              unicodeBidi: "plaintext",
              color: "#526eff",
            }}
          >
            <span dir="ltr" style={{ unicodeBidi: "plaintext" }}>
              {otp}
            </span>
          </Text>

          <Hr className="my-[16px] border-t-2 border-gray-300" />

          <Text style={{ color: "#6b7280", direction: "rtl" }}>
            این کد به دلایل امنیتی فقط برای مدت محدودی معتبر است. لطفاً هرچه
            سریع‌تر اقدام نمایید.
          </Text>
          <Text style={{ color: "#6b7280", direction: "rtl" }}>
            اگر شما این درخواست را ارسال نکرده‌اید، می‌توانید این ایمیل را
            نادیده بگیرید.
          </Text>

          <Hr className="my-[16px] border-t-2 border-gray-300" />

          <Link href={process.env.NEXT_PUBLIC_BASE_URL} style={linkStyles}>
            iGraphical.ir
          </Link>
        </Container>
      </Body>
    </Html>
  );
};

export const renderOtpEmail = (otp: string) =>
  render(<OtpEmail otp={otp} />, { pretty: true });

//! ----------------------------------------------------------

const FinishCourseEmail = ({
  fullName,
  courseTitle,
}: {
  fullName: string;
  courseTitle: string;
}) => {
  return (
    <Html lang="fa" dir="rtl">
      <Head />
      <Preview>🎉 تبریک {fullName} عزیز!</Preview>
      <Body style={bodyStyles}>
        <Header />

        <Container style={containerStyles}>
          <Text style={{ fontSize: "18px", color: "#333", direction: "rtl" }}>
            {fullName} عزیز، 🎉تبریک می گوییم!
          </Text>

          <Hr className="my-[16px] border-t-2 border-gray-300" />

          <Text style={{ fontSize: "18px", color: "#333", direction: "rtl" }}>
            🔹 شما با موفقیت <strong>{courseTitle}</strong> را به اتمام رساندید.
            این یک دستاورد بزرگ است!
          </Text>

          <Hr className="my-[16px] border-t-2 border-gray-300" />

          <Text style={{ fontSize: "18px", color: "#333", direction: "rtl" }}>
            نظرات ارزشمند شما به ما کمک خواهد کرد تا کیفیت دوره‌های آموزشی خود
            را بهبود بخشیم.
          </Text>

          <Button
            href="https://igraphical.ir/panel/courses"
            style={buttonStyles}
          >
            ثبت امتیاز و دانلود مدرک
          </Button>

          <Hr className="my-[16px] border-t-2 border-gray-300" />

          <Link href={process.env.NEXT_PUBLIC_BASE_URL} style={linkStyles}>
            iGraphical.ir
          </Link>
        </Container>
      </Body>
    </Html>
  );
};

export const renderFinishCourseEmail = (
  courseTitle: string,
  fullName: string
) =>
  render(<FinishCourseEmail courseTitle={courseTitle} fullName={fullName} />, {
    pretty: true,
  });

//! ----------------------------------------------------------

export interface PaymentType extends Payment {
  enrollment: (Enrollment & { course: Course })[];
}

const SuccessPaymentEmail = (data: {
  fullName: string;
  payment: PaymentType;
}) => {
  const { fullName, payment } = data;

  return (
    <Html lang="fa" dir="rtl">
      <Head />
      <Preview>🔹 ثبت نام شما در آی‌گرافیکال موفق بود!</Preview>
      <Body style={bodyStyles}>
        <Header />

        <Container style={containerStyles}>
          <Text style={{ fontSize: "18px", color: "#333", direction: "rtl" }}>
            {fullName} عزیز،
          </Text>

          <Text style={{ fontSize: "18px", color: "#333", direction: "rtl" }}>
            از اعتماد شما به آی‌گرافیکال سپاس‌گزاریم 🌟
            <br />
            پرداخت شما به مبلغ{" "}
            <strong>{payment.total.toLocaleString("en-US")} تومان</strong> با
            موفقیت انجام شد و ثبت‌نام در دوره‌های زیر تکمیل گردید:
          </Text>

          <Hr className="my-[16px] border-t-2 border-gray-300" />

          {payment.enrollment.map(({ course }, index) => (
            <Text
              key={index}
              style={{
                fontSize: "18px",
                color: "#333",
                direction: "rtl",
              }}
            >
              🎓 {course.title}
            </Text>
          ))}

          <Hr className="my-[16px] border-t-2 border-gray-300" />

          <Button
            href="https://igraphical.ir/panel/courses"
            style={buttonStyles}
          >
            ورود به پنل و مشاهده دوره‌ها
          </Button>

          <Hr className="my-[16px] border-t-2 border-gray-300" />

          <Text
            style={{
              fontSize: "14px",
              color: "#888",
              direction: "rtl",
              textAlign: "center",
            }}
          >
            هر زمان که نیاز به پشتیبانی داشتید، از طریق سایت یا پنل کاربری با ما
            در ارتباط باشید.
          </Text>

          <Link href={process.env.NEXT_PUBLIC_BASE_URL} style={linkStyles}>
            iGraphical.ir
          </Link>
        </Container>
      </Body>
    </Html>
  );
};

export const renderSuccessPaymentEmail = (
  fullName: string,
  payment: PaymentType
) =>
  render(<SuccessPaymentEmail payment={payment} fullName={fullName} />, {
    pretty: true,
  });

//! ----------------------------------------------------------
