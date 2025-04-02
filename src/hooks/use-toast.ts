
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
  action?: React.ReactNode;
};

export const toast = ({ title, description, variant = "default", duration = 3000, action }: ToastProps) => {
  sonnerToast[variant === "destructive" ? "error" : "success"](
    title,
    {
      description,
      duration,
      action
    }
  );
};

export const useToast = () => {
  return {
    toast,
    toasts: [],
  };
};
