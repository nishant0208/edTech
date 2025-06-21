import { toast } from "sonner"; // or wherever your toast comes from

type ToastVariant = "default" | "destructive" | "success" | "info" | "warning";

interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export function useToast() {
  function showToast({
    title,
    description,
    variant = "default",
    duration,
  }: ToastProps) {
    toast({
      // @ts-ignore
      title,
      description,
      duration,
      className:
        variant === "destructive"
          ? "bg-red-600 text-white"
          : variant === "success"
          ? "bg-green-600 text-white"
          : undefined,
    });
  }

  return { toast: showToast };
}
