import NotifBarForm from "@/components/forms/announcement/NotifBarForm";
import { database } from "@igraph/database";

const page = async () => {
  const notifBar = await database.notifbar.findFirst();

  return (
    <div className="max-w-screen-sm">
      <NotifBarForm notifBar={notifBar} />
    </div>
  );
};

export default page;
