"use client";

import {
  studentProfile1,
  studentProfile2,
  studentProfile3,
  studentProfile4,
  studentProfile5,
  studentProfile6,
} from "@/public";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@igraph/ui/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Quote, Star } from "lucide-react";
import Image from "next/image";

const StudentReviews = () => {
  return (
    <div className="flex flex-col gap-16 justify-center items-center">
      <div className="space-y-2 text-center">
        <h2>دانش‌آموزان آی‌گرافیکال گفتن:</h2>
        <p className="text-sm text-gray-500">
          در این بخش، با بازخوردها و تجربه‌های مثبت هنرجویانی آشنا می‌شوید که
          مسیر یادگیری خود را با دوره‌های ما آغاز کرده‌اند.
        </p>
      </div>

      <Carousel
        plugins={[
          Autoplay({
            delay: 1500,
          }),
        ]}
        opts={{
          align: "start",
          loop: true,
        }}
        orientation="vertical"
        className="w-full max-w-md select-none"
      >
        <CarouselContent className="-mt-2 h-[350px] md:h-[610px]">
          {reviews.map((item, index) => (
            <CarouselItem key={index} className="basis-1/4 select-none">
              <StudentReviewCard review={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default StudentReviews;

const StudentReviewCard = ({
  review: { course, review, student },
}: {
  review: ReviewType;
}) => {
  return (
    <div className="card py-4 space-y-2" dir="rtl">
      <div className="flex gap-5">
        <div className="relative">
          <Image
            alt=""
            src={student.imageUrl}
            width={130}
            height={130}
            className="aspect-square object-cover rounded-lg"
          />
          <div className="absolute -top-3 -left-3 flex justify-center items-center bg-primary p-2.5 rounded-full text-white border-white border-4">
            <Quote size={15} />
          </div>
        </div>

        <div className="space-y-2 w-full ">
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                fill="#eab308"
                size={16}
                className="text-yellow-500"
              />
            ))}
          </div>
          <div className="text-gray-500 text-sm">{review}</div>
        </div>
      </div>
      <div>
        <p className="font-medium">{student.name}</p>
        <p className="text-xs text-gray-500">
          دانش آموز <span className="text-primary">{course.title}</span>
        </p>
      </div>
    </div>
  );
};

interface ReviewType {
  student: {
    name: string;
    imageUrl: string;
  };
  review: string;
  course: {
    title: string;
  };
}

const reviews: ReviewType[] = [
  {
    student: { name: "محمدرضا سید طاهری", imageUrl: studentProfile1 },
    review:
      "در عین خلاصه بودن، تمام چیز هایی که لازمه رو توضیح میدین و برخلاف بقیه که از توضیح بعضی جزئیات طفره میرن، شما وافعا همه رو توضیح میدین",
    course: { title: "دوره فشرده ادوبی ایندیزاین" },
  },

  {
    student: { name: "محمد امین برهانی", imageUrl: studentProfile2 },
    review:
      "مطالب دوره به شدت عالی و جامع و استاد و نحوه بیان و تدریس شون هم خیلی خیلی خوب و عالی بود. من واقعا راضیم و واقعا میگم حلالتون باشه.",
    course: { title: "دوره آموزش طراحی بسته بندی و لیبل" },
  },

  {
    student: { name: "میترا امین زاده", imageUrl: studentProfile3 },
    review:
      "روش تدریس آی گرافیکال خیلی متفاوت تر از هر کسیه که تو دنیای آموزش آنلاین فعالیت داره. مخصوصا اینه که هیچ اضافه گویی در آموزش های شما نیست.",
    course: { title: "دوره جامع نرم افزار ادوبی ایلوستریتور" },
  },

  {
    student: { name: "آرین طاهربابایی", imageUrl: studentProfile4 },
    review:
      "پک جامع آموزشتون در عین سادگی و بیان شیوا بسیار دقیق و کاربردی بود. بسیار راضی هستم از خرید و وقت گذاشتن برای این دوره",
    course: { title: "دوره جامع نرم افزار ادوبی فتوشاپ" },
  },

  {
    student: { name: "کیانا بذرافشان", imageUrl: studentProfile5 },
    review:
      "هزاران بار تشکر بابت آموزش های بسیار عالی مجموعه علمی-آموزشی آی گرافیکال همیشه سپاسگذار صداقت و وجدان کاری شما هستم.",
    course: { title: "دوره طراحی کارت ویزیت برش خاص و معمول" },
  },

  {
    student: { name: "وحیده گویلی", imageUrl: studentProfile6 },
    review:
      "کلا آموزش ایندیزاین خیلی کم یاب بود و سایتای زیادی رو سر زدم، اما قدرت بیان و ارتباطی که استاد با دانش آموز میگیره واقعا دوست داشتنیه.",
    course: { title: "دوره جامع نرم افزار ادوبی ایندیزاین" },
  },
];
