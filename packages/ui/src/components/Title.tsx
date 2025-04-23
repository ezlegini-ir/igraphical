const Title = ({ title, className }: { title: string; className?: string }) => {
  return (
    <h2 className={`text-sm text-gray-500 font-medium ${className}`}>
      {title}
    </h2>
  );
};

export default Title;
