import { Check } from "lucide-react";
import React from "react";

const CourseLearnsInCourse = ({
  learnsInCourse,
}: {
  learnsInCourse: string[];
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 text-primary">
        در این دوره یاد می گیرید:
      </h2>
      <ul className="md:columns-2  space-y-2 mr-3">
        {learnsInCourse.map((item, index) => (
          <li key={index} className="flex items-center gap-2 text-slate-600">
            <Check size={18} className="text-green-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseLearnsInCourse;
