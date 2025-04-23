import { TriangleAlert } from "lucide-react";

const Error = ({ error }: { error: string }) => {
  if (!error) return null;

  return (
    <p className="alert alert-danger mb-3 flex items-center justify-center gap-1">
      <TriangleAlert size={20} />
      {error}
    </p>
  );
};

export default Error;
