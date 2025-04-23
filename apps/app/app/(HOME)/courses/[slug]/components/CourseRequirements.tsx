import React from "react";

const CoursePrerequisite = ({
  requirements,
}: {
  requirements: string[] | undefined;
}) => {
  if (!requirements) return;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">پیش نیاز ها:</h2>
      <ul className="space-y-2 list-disc mr-3">
        {requirements.map((item, index) => (
          <li key={index} className="text-slate-600">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoursePrerequisite;
