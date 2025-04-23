import Avatar from "@igraph/ui/components/Avatar";
import { Button } from "@igraph/ui/components/ui/button";
import { formatMiladiDate } from "@igraph/utils";
import { truncateFileName } from "@igraph/utils";
import {
  AskTutor,
  AskTutorMessages,
  Course,
  File,
  Image as ImageType,
  Tutor,
  User,
} from "@igraph/database";
import { Download } from "lucide-react";
import Link from "next/link";

interface QaType extends AskTutor {
  tutor: Tutor & { image: ImageType | null };
  user: User & { image: ImageType | null };
  messages: (AskTutorMessages & { attachment: File | null })[] | null;
  course: Course;
}

interface Props {
  qa: QaType;
}

const QaChat = ({ qa }: Props) => {
  return (
    <div className="py-3 space-y-3" dir="rtl">
      {qa?.messages?.map((message, index) => (
        <div key={index} className="space-y-3 text-sm">
          <div
            className={`card py-2 ${
              message.senderType === "USER" && "bg-slate-100"
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <Avatar
                  src={
                    message.senderType === "USER"
                      ? qa.user.image?.url
                      : qa.tutor.image?.url
                  }
                />
                <div>
                  <p>
                    {message.senderType === "USER"
                      ? qa.user.fullName
                      : qa.tutor.displayName}
                  </p>
                  <span dir="ltr" className="text-xs text-gray-500">
                    {formatMiladiDate(message.createdAt)}
                  </span>
                </div>
              </div>
              <p>{message.message}</p>
            </div>
            {message.attachment && (
              <div className="flex justify-end">
                <Link
                  href={message.attachment.url}
                  className="flex items-center gap-2"
                >
                  <span className="text-gray-500">
                    {truncateFileName(message.attachment?.fileName)}
                  </span>
                  <Button size={"icon"} className="h-8 w-8" type="button">
                    <Download />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QaChat;
