"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@igraph/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@igraph/ui/components/ui/select";
import { enrollmentStatus } from "@/lib/validationSchema";
import { EnrollmentType } from "@/app/(DASHBOARD)/enrollments/list/EnrollmentsList";
import { deleteEnrollment, updateEnrollmentStatus } from "@/actions/payment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DeleteButton from "@igraph/ui/components/DeleteButton";

export const enrollmentStatusFormForm = z.object({
  enrollmentStatus: z.enum(enrollmentStatus),
});
export type EnrollmentStatusFormType = z.infer<typeof enrollmentStatusFormForm>;

function EnrollmentStatusForm({ enrollment }: { enrollment: EnrollmentType }) {
  //HOOKS
  const router = useRouter();

  const form = useForm<EnrollmentStatusFormType>({
    resolver: zodResolver(enrollmentStatusFormForm),
    defaultValues: {
      enrollmentStatus: enrollment?.status,
    },
  });

  const onSubmit = async (data: EnrollmentStatusFormType) => {
    const res = await updateEnrollmentStatus(data, enrollment.id);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      router.refresh();
    }
  };

  const onDelete = async () => {
    const res = await deleteEnrollment(enrollment.id!);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="enrollmentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Update Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {enrollmentStatus.map((item, index) => (
                    <SelectItem key={index} value={item} className="capitalize">
                      <span
                        className={`capitalize ${item === "PENDING" ? "text-orange-400" : item === "IN_PROGRESS" ? "text-primary" : "text-green-500"}`}
                      >
                        {item.toLowerCase()}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button
            disabled={!form.formState.isDirty}
            className="w-full"
            type="submit"
          >
            Submit
          </Button>
          <DeleteButton onDelete={onDelete} />
        </div>
      </form>
    </Form>
  );
}

export default EnrollmentStatusForm;
