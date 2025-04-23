"use client";

import React from "react";
import ReadOnlyEditor from "@igraph/editor/ReadOnlyEditor";
import CourseAudienceItems from "./CourseAudience";

interface CourseDescriptionProps {
  content: string; // Your stored Lexical JSON string
  courseDescriptionItems: {
    audience: string;
    needs: string;
    bazaar: string;
  };
}

const CourseDescription: React.FC<CourseDescriptionProps> = ({
  content,
  courseDescriptionItems,
}) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">درباره این دوره:</h2>
      <div className="card p-5">
        <ReadOnlyEditor content={content} />
      </div>
      <CourseAudienceItems courseContentItems={courseDescriptionItems} />
    </div>
  );
};

export default CourseDescription;
