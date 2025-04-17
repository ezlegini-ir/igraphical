import {
  Card,
  CardContent,
  CardDescription,
} from "@igraph/ui/components/ui/card";
import { tutorPlaceholder } from "@/public";
import { Image as ImageType, Tutor } from "@igraph/database";
import Image from "next/image";
import Link from "next/link";

interface Props {
  tutor: Tutor & { image: ImageType | null };
}

const CourseTutor = ({ tutor }: Props) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">مدرس دوره:</h2>
      <Card className="bg-none shadow-none">
        <CardContent className="py-4 flex flex-col md:flex-row items-center md:items-start flex-wrap md:flex-nowrap md:gap-5">
          <Image
            alt="tutor"
            src={tutor.image?.url || tutorPlaceholder}
            width={750}
            height={750}
            className="w-60 h-7w-60 object-cover"
          />

          <div className="mt-14 text-slate-500 space-y-5 ">
            <div>
              <h3 className="text-black mb-1 text-2xl">
                <Link href={`/tutors/${tutor.slug}`}>{tutor.displayName}</Link>
              </h3>
              <div className="flex gap-2 items-stretch">
                <div className="w-[2px] bg-slate-300" />
                <pre className="text-gray-400 text-sm">{tutor.titles}</pre>
              </div>
            </div>

            <CardDescription>{tutor.bio}</CardDescription>

            {/* <SocialsIcon /> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseTutor;
