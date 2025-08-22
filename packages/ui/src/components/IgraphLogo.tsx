import Image from "next/image";

interface Props {
  width?: number;
  height?: number;
  inputProps?: any;
  className?: string;
}

const IgraphLogo = ({ inputProps, className, width, height }: Props) => {
  return (
    <Image
      src={"/igraph-logo.svg"}
      alt={"iGraph"}
      width={width || 142}
      height={height || 44}
      draggable={false}
      {...inputProps}
      className={className}
    />
  );
};

export default IgraphLogo;
