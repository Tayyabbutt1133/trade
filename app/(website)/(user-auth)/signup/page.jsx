import { SignUpForm } from "@/components/SignUpForm";
import { fonts } from "@/components/ui/font";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-100">
      <div className="space-y-8 p-8 rounded-xl">
        <div className="text-center">
          <h2
            className={`mt-2 text-3xl font-bold text-gray-900 ${fonts.montserrat}`}
          >
            Create your account
          </h2>
        </div>
        <SignUpForm />
        <p
          className={`mt-2 text-center text-sm text-gray-600 ${fonts.montserrat}`}
        >
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-medium text-[#37bfb1] hover:text-[#2ea89b]"
          >
            Sign in
          </Link>
        </p>
        <p
          className={`${fonts.montserrat} text-center text-[15px] underline animate-pulse text-[#277477]`}
        >
          Tell colleagues about this website
        </p>
      </div>
    </div>
  );
}
