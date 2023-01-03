import { CheckIcon, LinkIcon } from "@chakra-ui/icons";
import { Button, HStack, Text } from "@chakra-ui/react";

type CopyToClipboardButtonProps = {
  eventId: string;
  copied: boolean;
  setCopied: (copied: boolean) => void;
};

export default function CopyToClipboardButton(
  props: CopyToClipboardButtonProps
) {
  const { eventId, copied, setCopied } = props;

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
          <CheckIcon color="white" />
        </HStack>
      ) : (
        <LinkIcon />
      )}
    </Button>
  );

  async function copyToClipboard(eventId: string) {
    await navigator.clipboard.writeText(
      `${window.location.origin}/e/${eventId}`
    );
  }
}
