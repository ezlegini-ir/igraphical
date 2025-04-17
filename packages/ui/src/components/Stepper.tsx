import { LucideIcon } from "lucide-react";
import { Badge } from "@igraph/ui/components/ui/badge";

interface Props {
  steps: {
    icon: LucideIcon;
  }[];
  active: number;
}

const Stepper = ({ steps, active }: Props) => {
  const lastStep = steps.length > 0 ? steps[steps.length - 1] : null;

  return (
    <ol className="flex w-full items-center mx-auto mb-4 sm:mb-5">
      {steps.slice(0, -1).map((step, index) => (
        <li
          key={index}
          className="flex w-full items-center text-blue-600 dark:text-blue-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-slate-200 after:border-4 after:inline-block dark:after:border-blue-800"
        >
          <Badge
            variant={index < active ? "richBlue" : "gray"}
            className="h-11 w-11 rounded-full"
          >
            <step.icon className="scale-125" />
          </Badge>
        </li>
      ))}

      {lastStep && (
        <li className="flex items-center">
          <Badge
            variant={steps.length === active ? "richBlue" : "gray"}
            className="h-11 w-11 rounded-full"
          >
            <lastStep.icon className="scale-125" />
          </Badge>
        </li>
      )}
    </ol>
  );
};

export default Stepper;
