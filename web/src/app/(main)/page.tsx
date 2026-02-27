import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to ClassFlow
        </h1>
        <p className="text-gray-700 mb-6">
          Your all-in-one solution for managing classes with ease.
        </p>
        <Image
          src="/dashboard-screenshot.png"
          alt="ClassFlow Dashboard"
          width={800}
          height={400}
          className="rounded-lg shadow-md"
        />
      </div>
    </div>
  );
}
