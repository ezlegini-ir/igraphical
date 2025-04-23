import { igraphLogoCard } from "@/public";
import Avatar from "@igraph/ui/components/Avatar";
import { Button } from "@igraph/ui/components/ui/button";
import { formatJalaliDate, truncateFileName } from "@igraph/utils";
import { Download } from "lucide-react";
import Image from "next/image";
import { TicketMessagesProps } from "./TicketChat";

const TicketMessages = ({ messages }: TicketMessagesProps) => {
  return (
    <div className="space-y-3 max-h-[750px] overflow-auto">
      {messages?.map((message, index) => (
        <div key={index} className="space-y-3 text-sm">
          <div
            className={`card p-4 group relative ${
              message.senderType === "USER" && "bg-slate-100"
            }`}
          >
            <div className="w-full">
              <div className="flex items-center gap-2">
                {message.senderType === "ADMIN" ? (
                  <Image alt="" src={igraphLogoCard} width={40} height={40} />
                ) : (
                  <Avatar src={message.user?.image?.url} />
                )}

                <div className="flex flex-col">
                  <span>
                    {message.senderType === "ADMIN"
                      ? "آی‌گرافیکال"
                      : message.user?.fullName}
                  </span>
                  <span className="text-xs text-gray-400 en-digits">
                    {formatJalaliDate(message.createdAt, {
                      useMonthName: false,
                      withTime: true,
                    })}
                  </span>
                </div>
              </div>
              <pre className="text-black bg-transparent text-sm">
                {message.message}
              </pre>
            </div>
            {message.attachment && (
              <div className="space-y-2">
                <hr className="border-dashed border-slate-300" />
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={message.attachment.url}
                  className="flex justify-end gap-2 items-center text-nowrap text-xs text-gray-500"
                >
                  <span title={message.attachment.fileName}>
                    {truncateFileName(message.attachment.fileName, 30)}
                  </span>
                  <Button
                    variant={"lightBlue"}
                    size={"icon"}
                    className="h-8 w-8"
                    type="button"
                  >
                    <Download />
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketMessages;
