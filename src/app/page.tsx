import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>Hello Home Page with latest nextjs</h1>

      <Show when="signed-out">

        <SignInButton mode="modal">
          <button className="bg-blue-500 m-2 p-2">
            Sign In
          </button>
        </SignInButton>

        <SignUpButton mode="modal">
          <button className="bg-blue-500 m-2 p-2">
            Sign Up
          </button>
        </SignUpButton>

      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>

    </div>
  );
}
