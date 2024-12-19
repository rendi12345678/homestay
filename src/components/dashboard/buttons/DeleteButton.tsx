"use client";

import { type ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { RiDeleteBin6Line } from "react-icons/ri";
import useCustomToast from "@/hooks/useCustomToast";

export interface DeleteButtonProps {
  id: string;
  action: (id: string) => Promise<{ message: string; status: string }>;
}

export default function DeleteButton({
  id,
  action,
}: DeleteButtonProps): ReactElement {
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const handleDeleteAction = async () => {
    try {
      const response = await action(id);

      if (response.status === "error") return showErrorToast({ title: "Error", description: response.message });

      showSuccessToast({
        title: "Success",
        description: response.message,
      });
    } catch (error) {

      showErrorToast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    }
  };

  return (
    <Button
      onClick={handleDeleteAction}
      size="sm"
      variant="ghost"
      className="bg-transparent"
    >
      <RiDeleteBin6Line className="text-destructive text-lg" />
    </Button>
  );
}
