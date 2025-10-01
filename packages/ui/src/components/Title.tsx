const Title = ({ title, className }: { title: string; className?: string }) => {
  return (
    <h2 className={`text-sm text-muted-foreground font-medium ${className}`}>
      {title}
    </h2>
  );
};

export default Title;
