"use client";

import {
  Image as ImageType,
  Slider as SlidersType,
  SliderType,
} from "@igraph/database";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@igraph/ui/components/ui/carousel";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { sliderPlaceholder } from "@/public";

interface Props {
  type: SliderType;
  sliders: (SlidersType & { image: ImageType | null })[];
}

export default function Slider({ type, sliders }: Props) {
  //HOOKS
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const sliderStyles = `object-cover rounded-lg ${
    type === "PANEL"
      ? // PANEL
        "aspect-[2.3/1] sm:aspect-[2.8/1] md:aspect-[2.25/1] lg:aspect-[3.5/1] xl:aspect-[5.43/1]"
      : // MAIN
        "aspect-[2/1] sm:aspect-[2.2/1] md:aspect-[2.4/1] lg:aspect-[2.94/1]"
  } `;

  return (
    <div className="mx-auto">
      <Carousel
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
        setApi={setApi}
        dir="ltr"
      >
        <CarouselContent>
          {sliders.map((slider, index) => (
            <CarouselItem key={index} className="select-none">
              {slider.link ? (
                <Link target="_blank" href={slider.link}>
                  <Image
                    src={slider.image?.url || sliderPlaceholder}
                    alt="slider"
                    width={1300}
                    height={1300}
                    className={sliderStyles}
                  />
                </Link>
              ) : (
                <Image
                  src={slider.image?.url || sliderPlaceholder}
                  alt="slider"
                  width={1300}
                  height={1300}
                  className={sliderStyles}
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        {sliders.length > 1 && (
          <>
            <CarouselPrevious className="hidden xl:flex" />
            <CarouselNext className="hidden xl:flex" />
          </>
        )}
      </Carousel>

      <div dir="ltr" className="mt-2 flex justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              "h-2 w-2 rounded-full transition-colors duration-300",
              index + 1 === current
                ? "bg-primary w-5"
                : "bg-muted-foreground/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
