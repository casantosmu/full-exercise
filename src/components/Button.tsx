import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  PropsWithChildren,
} from "react";

type ButtonProps = PropsWithChildren<{
  size?: "extra-small" | "small" | "base" | "large" | "extra-large";
}> &
  (
    | (ButtonHTMLAttributes<HTMLButtonElement> & {
        as?: "button";
      })
    | (AnchorHTMLAttributes<HTMLAnchorElement> & {
        as: "link";
      })
  );

export default function Button({
  children,
  as = "button",
  size = "base",
  ...rest
}: ButtonProps) {
  const Component = as === "button" ? "button" : "a";

  let sizeStyles;
  switch (size) {
    case "extra-small":
      sizeStyles = "px-3 py-2 text-xs";
      break;
    case "small":
      sizeStyles = "px-3 py-2 text-sm";
      break;
    case "base":
      sizeStyles = "px-5 py-2.5 text-sm";
      break;
    case "large":
      sizeStyles = "px-5 py-3 text-base";
      break;
    case "extra-large":
      sizeStyles = "px-6 py-3.5 text-base";
      break;
  }

  return (
    // @ts-expect-error Improve Polymorphic React Button-or-Link
    <Component
      className={`inline-flex justify-center items-center text-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg ${sizeStyles} dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800`}
      {...rest}
    >
      {children}
    </Component>
  );
}
