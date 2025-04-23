import { Badge } from "@igraph/ui/components/ui/badge";
import { tutorPlaceholder } from "@/public";
import {
  Course,
  Enrollment,
  Image as ImageType,
  Tutor,
} from "@igraph/database";
import Image from "next/image";
import Link from "next/link";

export interface TutorType extends Tutor {
  image: ImageType | null;
  courses: ((Course & { enrollment: Enrollment[] }) | null)[];
}

interface Props {
  tutor: TutorType;
}

const TutorCard = ({ tutor }: Props) => {
  const courseCount = tutor.courses.length;
  const courseDuration = tutor.courses.reduce(
    (acc, curr) => acc + (curr?.duration || 0),
    0
  );
  const studentCount = tutor.courses.reduce(
    (acc, curr) => acc + (curr?.enrollment.length || 0),
    0
  );

  const tutorRecords = [
    { title: "دوره", value: courseCount },
    { title: "دقیقه آموزش", value: courseDuration },
    { title: "دانش‌آموز", value: studentCount },
  ];

  return (
    <Link href={`/tutors/${tutor.slug}`}>
      <div className="card flex flex-col items-center space-y-3 relative overflow-visible mb-12 hover:shadow-md">
        <Image
          alt=""
          src={tutor.image?.url || tutorPlaceholder}
          width={185}
          height={185}
          className="absolute -top-10"
        />
        <div className="space-y-2 pt-44">
          <h2 className="font-semibold tracking-wide">{tutor.displayName}</h2>
          <div className="flex gap-6">
            {tutorRecords.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <Badge
                  variant={"outline"}
                  className="rounded-sm h-5 text-[10px] pt-1 tracking-wider"
                >
                  {item.value.toLocaleString("en-US")}
                </Badge>
                <p className="text-xs font-medium text-gray-500">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TutorCard;
