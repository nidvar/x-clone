import { Button } from "@/components/ui/button";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>Hello Home Page with latest nextjs</h1>

      <Show when="signed-out">

        <SignInButton mode="modal">
          <Button>Sign In</Button>
        </SignInButton>

        <SignUpButton mode="modal">
          <Button variant={"secondary"}>Sign Up</Button>
        </SignUpButton>

      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>

    </div>
  );
}
