import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg rounded-lg border border-line bg-white/5 p-8 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Link href="/" className="mt-5 inline-flex rounded-lg bg-mint px-4 py-2 font-medium text-black">Back home</Link>
    </div>
  );
}
