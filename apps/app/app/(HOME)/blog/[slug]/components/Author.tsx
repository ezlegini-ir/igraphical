import { avatar } from "@/public";
import Image from "next/image";

interface Props {
  author: { name: string } & {
    image?: {
      url: string;
    };
  };
}

const Author = ({ author }: Props) => {
  return (
    <p className="flex gap-3 items-center text-gray-500">
      Author:{" "}
      <Image
        width={40}
        height={40}
        src={author.image?.url || avatar}
        alt="author"
        className="rounded-full"
      />
      {author.name}
    </p>
  );
};

export default Author;
