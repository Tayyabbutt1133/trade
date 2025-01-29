import { Button } from "@/components/ui/button"
import { FaGoogle, FaLinkedin, FaApple } from "react-icons/fa"

export function SocialSignInButtons() {
  return (
    <div className="space-y-2">
      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
        <FaGoogle className="w-5 h-5" />
        Continue with Google
      </Button>
      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
        <FaLinkedin className="w-5 h-5" />
        Continue with LinkedIn
      </Button>
      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
        <FaApple className="w-5 h-5" />
        Continue with Apple
      </Button>
    </div>
  )
}

