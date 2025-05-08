import Image from "next/image";

interface Props {
  size?: number;
  inputProps?: any;
}

const IgraphLogoSquare = ({ size, inputProps }: Props) => {
  return (
    <Image
      src={"/igraph-logo-card.svg"}
      alt={"iGraphical"}
      width={size || 50}
      height={size || 50}
      draggable={false}
      {...inputProps}
      priority
      loading="eager"
      className="hover:scale-105 transition-transform"
    />
  );
};

export default IgraphLogoSquare;
