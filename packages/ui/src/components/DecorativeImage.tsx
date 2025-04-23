import Image from "next/image";

const DecorativeImage = () => {
  return (
    <Image
      width={500}
      height={500}
      src={"/bg-pattern.png"}
      alt=""
      className="absolute -top-40 md:left-52 select-none pointer-events-none -z-10"
    />
  );
};

export default DecorativeImage;
