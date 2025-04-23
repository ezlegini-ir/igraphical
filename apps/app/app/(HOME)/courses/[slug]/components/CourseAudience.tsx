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
    <div className="space-y-3">
      <div className="card space-y-3">
        <h3 className="text-base text-primary">مخاطبین دوره</h3>
        <p>{courseContentItems.audience}</p>
      </div>

      <div className="lg:flex gap-3 space-y-3 lg:space-y-0">
        <div className="card space-y-2 lg:w-1/2 h-min">
          <h3 className="text-base text-primary">ملزومات دوره</h3>
          <pre>{courseContentItems.needs}</pre>
        </div>

        <div className="card space-y-2 lg:w-1/2 h-min">
          <h3 className="text-base text-primary">بازار کار</h3>
          <p>{courseContentItems.bazaar}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseAudienceItems;
