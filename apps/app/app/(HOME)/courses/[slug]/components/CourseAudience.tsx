import React from "react";
interface Props {
  courseContentItems: {
    audience: string;
    needs: string;
    bazaar: string;
  };
}

const CourseAudienceItems = ({ courseContentItems }: Props) => {
  return (
    <div className="grid grid-cols-2 grid-rows-[auto_auto] gap-3">
      <div className="card col-span-2 space-y-2 self-start">
        <h3 className="text-base">مخاطبین دوره</h3>
        <p>{courseContentItems.audience}</p>
      </div>

      <div className="card space-y-2">
        <h3 className="text-base">ملزومات دوره</h3>
        <pre>{courseContentItems.needs}</pre>
      </div>

      <div className="card space-y-2">
        <h3 className="text-base">بازار کار</h3>
        <p>{courseContentItems.bazaar}</p>
      </div>
    </div>
  );
};

export default CourseAudienceItems;
