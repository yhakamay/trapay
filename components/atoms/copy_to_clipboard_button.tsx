import { Button, HStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { MdCheck, MdLink } from "react-icons/md";

type CopyToClipboardButtonProps = {
  eventId: string;
};

export default function CopyToClipboardButton(
  props: CopyToClipboardButtonProps
) {
  const { eventId } = props;
  const [copied, setCopied] = useState(false);

  return (
    <Button
      onClick={async () => {
        await copyToClipboard(eventId);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }}
      aria-label="Link"
      size="sm"
      variant="outline"
      bg={copied ? "green" : undefined}
    >
      {copied ? (
        <HStack>
          <Text color="white">Copied!</Text>
          <MdCheck color="white" />
        </HStack>
      ) : (
        <MdLink />
      )}
    </Button>
  );

  async function copyToClipboard(eventId: string) {
    await navigator.clipboard.writeText(
      `${window.location.origin}/e/${eventId}`
    );
  }
}
