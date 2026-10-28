import React, { useMemo } from "react";
import DOMPurify from "dompurify";
import "./richtext.css";

interface RichTextProps {
  ck5_data?: string | null;
}

const RichText: React.FC<RichTextProps> = ({ ck5_data }) => {
  const sanitizedHtml = useMemo(
    () => DOMPurify.sanitize(ck5_data ?? ""),
    [ck5_data]
  );
  if (!sanitizedHtml) return null;

  return (
    <div
      className="rich-text-block ck5"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    >

    </div>
  );
};

export default RichText;