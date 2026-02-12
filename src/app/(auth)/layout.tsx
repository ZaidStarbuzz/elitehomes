import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold tracking-tight">
              {APP_NAME}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Hostel Management System
            </p>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
