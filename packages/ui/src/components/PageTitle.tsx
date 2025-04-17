interface Props {
  title: string;
  description: string;
}

const PageTitle = ({ title, description }: Props) => {
  return (
    <div className="flex flex-col items-center mt-6 md:mt-12 pb-12 space-y-3">
      <h1 className="text-primary">{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export default PageTitle;
