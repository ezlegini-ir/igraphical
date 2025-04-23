import TicketMessageForm from "@/components/forms/TicketMessageForm";
import { Separator } from "@igraph/ui/components/ui/separator";
import TicketMessages from "./TicketMessages";
import { File, Image, TicketMessage, User } from "@igraph/database";

export interface TicketMessagesProps {
  messages: (TicketMessage & {
    user: (User & { image: Image | null }) | null;
    attachment: File | null;
  })[];
}

const TicketChat = ({ messages }: TicketMessagesProps) => {
  return (
    <div className="space-y-4">
      <TicketMessageForm ticketId={messages[0].ticketId} />

      <Separator />

      <TicketMessages messages={messages} />
    </div>
  );
};

export default TicketChat;
