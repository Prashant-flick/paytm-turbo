"use client"
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react'
import Link from "next/link";

function ShowError() {
    const searchParams = useSearchParams()
    const error = searchParams.get("error")
    if(error){
        return (
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-red-900">{error}</h1>
            </div>
        );
    }
    return null
}

export default function(){
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    
    
    return (
        <div className="bg-black h-screen w-full flex items-center justify-center">
            <div className="border-2 border-gray-600 flex flex-col px-4 py-2 gap-2 justify-center items-center">
                <input 
                    type="email" 
                    placeholder="email or number"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                    className="text-white"
                    onClick={async() => {
                        await signIn("email", {
                            email: email,
                            number: email,
                            password: password,
                            signup: "false",
                            redirect: true
                        })
                    }}
                >
                    Login with Email
                </button>
                <button 
                    className="text-white"
                    onClick={async() => {
                        await signIn("google");
                    }}
                >
                    Login with Google
                </button>
                <Link className="text-white hover:text-gray-400" href="/signup">Sign Up</Link>
                <Suspense>
                    <ShowError />
                </Suspense>
            </div>
        </div>
    )
}