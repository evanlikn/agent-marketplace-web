"use client";

import { useState } from "react";

export function CopyCanonicalIdButton({ canonicalId }: { canonicalId: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(canonicalId);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      type="button"
    >
      {copied ? "Copied" : "Copy ID"}
    </button>
  );
}
