export default function Navbar() {
  return (
    <nav className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="./favicon-96.png" className="h-8" alt="Sport Time Fit Logo" />
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          Sport Time Fit
        </span>
      </a>
    </nav>
  );
}
