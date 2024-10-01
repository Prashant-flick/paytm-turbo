"use client"
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function(){
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [number, setNumber] = useState<string>("")

    const handleSignIn = async() => {
        try {
            await signIn("email", {
                email: email,
                password: password,
                name: name,
                number: number,
                signup: "true",
                redirect: true
            })
        } catch (error) {
            throw new Error("signup failed")
        }
    }

    return (
        <div className="bg-black h-screen w-full flex items-center justify-center">
            <div className="border-2 border-gray-600 flex flex-col px-4 py-2 gap-2">
                <input 
                    type="text" 
                    placeholder="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                />
                <input 
                    type="email" 
                    placeholder="email"
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
                    onClick={handleSignIn}
                >
                    SignUp with Email
                </button>
                <button 
                    className="text-white"
                    onClick={async() => {
                        await signIn("google");
                    }}
                >
                    SignUp with Google
                </button>
            </div>
        </div>
    )
}