import type { HTMLAttributes, PropsWithChildren } from "react";

type ParagraphProps = PropsWithChildren<{
  fontSize?: "xs" | "sm" | "base" | "lg" | "xl";
  fontWeight?:
    | "thin"
    | "extralight"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold";
  alignment?: "left" | "center" | "right";
  letterSpacing?: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";
}> &
  HTMLAttributes<HTMLParagraphElement>;

export default function Paragraph({
  children,
  fontSize = "base",
  fontWeight = "normal",
  alignment = "left",
  letterSpacing = "normal",
  ...rest
}: ParagraphProps) {
  return (
    <p
      className={`text-${fontSize} font-${fontWeight} text-${alignment} tracking-${letterSpacing} text-gray-500 dark:text-gray-400`}
      {...rest}
    >
      {children}
    </p>
  );
}
