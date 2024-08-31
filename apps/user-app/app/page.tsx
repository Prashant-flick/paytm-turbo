"use client"
import { Appbar } from "@repo/ui/Appbar";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const session = useSession()
  
  return (
    <div className="text-3xl font-extrabold h-screen bg-black text-white flex-col">
      <Appbar onSignin={signIn} onSignout={signOut} user={session.data?.user}/>
      {JSON.stringify(session)}
    </div>
  );
}
