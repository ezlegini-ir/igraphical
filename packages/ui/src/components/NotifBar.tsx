import { database } from "@igraph/database";
import { Button } from "@igraph/ui/components/ui/button";
import Link from "next/link";

const NotifBar = async () => {
  const styles =
    "flex w-full flex-col sm:flex-row text-center gap-2 justify-center items-center rounded-lg p-2 hover:drop-shadow-md";

  const notifBar = await database.notifbar.findFirst({
    where: { active: true },
  });

  if (!notifBar) return;

  return (
    <div className="mb-3 w-full">
      {notifBar?.link ? (
        <Link
          target="_blank"
          className={styles}
          href={notifBar?.link}
          style={{
            backgroundColor: notifBar?.bgColor,
            color: notifBar?.textColor,
          }}
        >
          <p>{notifBar?.content}</p>

          <Button
            className="h-6 text-orange-950 border-white border"
            variant={"gold"}
            size={"sm"}
          >
            کلیک کنید
          </Button>
        </Link>
      ) : (
        <div
          style={{
            backgroundColor: notifBar?.bgColor,
            color: notifBar?.textColor,
          }}
          className={styles}
        >
          <p>{notifBar?.content}</p>
        </div>
      )}
    </div>
  );
};

export default NotifBar;
