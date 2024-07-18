import type { HTMLAttributes, PropsWithChildren } from "react";

type HeadingProps = PropsWithChildren<
  {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    letterSpacing?:
      | "tighter"
      | "tight"
      | "normal"
      | "wide"
      | "wider"
      | "widest";
  } & HTMLAttributes<HTMLHeadingElement>
>;

export default function Heading({
  children,
  as = "h1",
  size = as,
  letterSpacing = "normal",
  ...rest
}: HeadingProps) {
  const Component = as;

  let sizeStyles;
  switch (size) {
    case "h1":
      sizeStyles = "text-5xl font-extrabold";
      break;
    case "h2":
      sizeStyles = "text-4xl font-bold";
      break;
    case "h3":
      sizeStyles = "text-3xl font-bold";
      break;
    case "h4":
      sizeStyles = "text-2xl font-bold";
      break;
    case "h5":
      sizeStyles = "text-xl font-bold";
      break;
    case "h6":
      sizeStyles = "text-lg font-bold";
      break;
  }

  return (
    <Component
      className={`${sizeStyles} tracking-${letterSpacing} dark:text-white`}
      {...rest}
    >
      {children}
    </Component>
  );
}
