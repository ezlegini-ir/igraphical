import Avatar from "@igraph/ui/components/Avatar";
import { CommentType } from "./BlogPost";
import { formatJalaliDate } from "@igraph/utils";

const CommentsList = ({ comments }: { comments: CommentType[] }) => {
  return (
    <>
      {comments.map((item, index) => (
        <div key={index} className="card bg-transparent">
          <div className="flex gap-2 items-center mb-3">
            <Avatar src={item.author?.image?.url} />
            <div className="flex flex-col">
              {item.author ? item.author.fullName : item.fullName}
              <span className="text-gray-500 text-xs">
                {formatJalaliDate(item.createdAt)}
              </span>
            </div>
          </div>
          <pre className="text-sm">{item.content}</pre>
        </div>
      ))}
    </>
  );
};

export default CommentsList;
