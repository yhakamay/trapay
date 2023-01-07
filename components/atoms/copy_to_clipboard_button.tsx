import { Button, useToast } from "@chakra-ui/react";
import { MdLink } from "react-icons/md";

type CopyToClipboardButtonProps = {
  eventId: string;
};

export default function CopyToClipboardButton(
  props: CopyToClipboardButtonProps
) {
  const { eventId } = props;
  const toast = useToast();

  return (
    <Button
      onClick={() => onClickCopyToClipboard(eventId)}
      aria-label="Link"
      size="sm"
      variant="outline"
    >
      <MdLink />
    </Button>
  );

  async function onClickCopyToClipboard(eventId: string) {
    await copyToClipboard(eventId);
    toast.closeAll();
    toast({
      title: "Copied to clipboard",
      status: "success",
    });
  }

  async function copyToClipboard(eventId: string) {
    await navigator.clipboard.writeText(
      `${window.location.origin}/e/${eventId}`
    );
  }
}
