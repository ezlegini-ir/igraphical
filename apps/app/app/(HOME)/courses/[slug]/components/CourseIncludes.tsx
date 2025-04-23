import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
interface Props {
  courseIncludes: {
    label: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }[];
}

const CourseIncludes = ({ courseIncludes }: Props) => {
  return (
    <>
      <h3 className="font-semibold text-base">این دوره شامل:</h3>
      <ul className=" text-sm text-slate-500 space-y-4">
        {courseIncludes.map((item, index) => (
          <li key={index} className="flex gap-3 items-center">
            <item.icon size={16} />
            {item.label}
          </li>
        ))}
      </ul>
    </>
  );
};

export default CourseIncludes;
