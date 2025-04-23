import React from "react";

const CourseSummery = ({ summery }: { summery: string }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">توضیح مختصر</h2>
      <p>{summery}</p>
    </div>
  );
};

export default CourseSummery;
