import Slider from "@/components/Slider";
import { database } from "@igraph/database";
import IgraphLogoSquare from "@igraph/ui/components/IgraphLogoSquare";
import SocialsIcon from "@igraph/ui/components/SocialsIcon";
import { Button } from "@igraph/ui/components/ui/button";
import { Brush, MousePointer2, Pipette, Type } from "lucide-react";

const LandingPage = async () => {
  const sliders = await database.slider.findMany({
    where: { type: "MAIN", active: true },
    include: { image: true },
  });

  return (
    <div className="md:pt-12 space-y-10">
      <Slider type="MAIN" sliders={sliders} />

      <div className="flex h-full space-y-6 flex-col  items-center">
        <div className="text-slate-600 absolute w-full max-w-lg  hidden md:block">
          <div>
            <div className="card p-2 flex justify-center items-center absolute left-0 top-20">
              <MousePointer2 size={20} />
            </div>
            <div className="card p-2  flex justify-center items-center absolute right-0 top-24">
              <Pipette size={20} />
            </div>
          </div>
          <div className="absolute right-10 top-0 mt-60">
            <Type size={20} />
          </div>
          <div className="absolute left-10 top-0 mt-60">
            <Brush size={20} />
          </div>
        </div>

        <div className="text-center flex flex-col gap-5 items-center sm:pt-28  z-10">
          <IgraphLogoSquare size={90} />
          <h1 className=" md:mt-16 text-4xl leading-[60px] md:leading-none">
            آی‌گرافیکال: جایی که{" "}
            <span className="bg-primary text-white px-1 ">خلاقیت</span> جان
            می‌گیرد!
          </h1>

          <div className="mt-3">
            <SocialsIcon />
          </div>

          <p className="text-gray-500 text-sm">
            از مبتدی تا حرفه‌ای، یادگیری طراحی گرافیک را با دوره‌های تخصصی و
            پروژه‌محور تجربه کنید. <br />
            جدیدترین تکنیک‌ها، نرم‌افزارهای قدرتمند، و راهکارهای عملی برای تسلط
            بر گرافیک دیجیتال، همه در یکجا!
          </p>

          <div>
            <a href="#courses">
              <Button>مشاهده دوره ها</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
