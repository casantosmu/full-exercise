import Button from "../components/Button";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import Paragraph from "../components/Paragraph";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
        <Heading as="h1" size="h2" letterSpacing="tight">
          Beginner Routine (10 MIN) Basic Home Exercises
        </Heading>
        <div className="mt-4 mb-8 sm:px-16 lg:px-48">
          <Paragraph fontSize="lg">
            Simple exercises, no equipment needed. Perfect for beginners.
          </Paragraph>
        </div>
        <Button as="link" size="large" href="#">
          Get Started Now!
        </Button>
      </div>
    </>
  );
}
