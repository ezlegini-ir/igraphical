import Image from "next/image";

interface Props {
  size?: number;
  inputProps?: any;
  className?: string;
}

const IgraphLogo = ({ inputProps, className, size }: Props) => {
  return (
    <Image
      src={"/igraph-logo.svg"}
      alt={"iGraph"}
      width={size || 130}
      height={size || 130}
      draggable={false}
      {...inputProps}
      className={className}
    />
  );
};

export default IgraphLogo;
