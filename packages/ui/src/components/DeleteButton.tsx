import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@igraph/ui/components/ui/alert-dialog";
import { Button } from "@igraph/ui/components/ui/button";
import Loader from "./Loader";

interface Props {
  onDelete: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const DeleteButton = ({
  onDelete,
  loading = false,
  disabled = false,
}: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"destructive"}
          className="w-full flex gap-2"
          type="button"
          disabled={disabled}
        >
          {/* {<Loader loading={loading} />} */}
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            <Loader loading={loading} />
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
