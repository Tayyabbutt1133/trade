import { SignInForm } from "@/components/SignInForm" 
import { fonts } from "@/components/ui/font"
import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 rounded-xl">
        <div className="text-center">
          <h2 className={`mt-6 text-3xl font-bold text-gray-900 ${fonts.montserrat}`}>Sign in to your account</h2>
        </div>
        <SignInForm />
        <p className={`mt-2 text-center text-sm text-gray-600 ${fonts.montserrat}`}>
          Don't have an account?{" "}
          <Link href="/signup" className="font-medium text-[#37bfb1] hover:text-[#2ea89b]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

