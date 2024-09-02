import client from "@repo/db/client"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

export const authOptions : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "email",
            name: "email",
            credentials: {
                email: {label: "Email", placeholder: "Email", type: "text"},
                password: {label: "password", placeholder: "password", type: "password"},
                signup: {label: "signup", placeholder: "signup", type: "text"},
                name: {label: "name", placeholder: "name", type: "text"},
                number: {label: "number", placeholder: "numebr", type: "text"}
            },
            
            async authorize(credentials: any): Promise<any>{
                const existingUser = await client.user.findFirst({
                    where: {
                        OR: [
                            { email: credentials.email },
                            { number: credentials.number }
                        ]
                    },
                });

                if(existingUser){  
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password)
                    if(passwordValidation){                        
                        return {
                            verifiedPassword: true,
                            user: existingUser
                        }
                    }else{
                        throw new Error("invalid Password")
                    }
                }else{
                    if(credentials.signup==="true"){
                        const hashPassword = await bcrypt.hash(credentials.password, 10);
                        const res = await client.user.create({
                            data: {
                                name: credentials.name,
                                number: credentials.number,
                                email: credentials.email,
                                password: hashPassword,
                                auth_type: "Email"
                            },
                            select: {
                                id: true,
                                name: true,
                                number: true,
                                email: true,
                                auth_type: true
                            }
                        })

                        await client.balance.create({
                            data: {
                                userId: res.id,
                                amount: 0,
                                locked: 0
                            }
                        })                        

                        return {
                            user: res,
                            verifiedPassword: true,
                        }
                    }else{
                        throw new Error("user doesn't exist")
                    }
                }
            }
        }),
        GoogleProvider({
            // eslint-disable-next-line turbo/no-undeclared-env-vars
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            // eslint-disable-next-line turbo/no-undeclared-env-vars
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    callbacks: {
        async session({token, session}: any){            
            session.user = token.user.user            
            return session
        },
        async jwt({token, user}: any){
            if (user) {
                token.user = user;
            }
            return token;
        },
        async redirect({ baseUrl }: any) {
            return baseUrl
        },
        async signIn({user,account}: any): Promise<any>{            
            if(account?.provider === "google"){
                const existingUser = await client.user.findFirst({
                    where: {
                        email : user.email
                    }
                })
                if(existingUser){
                    return true;
                }else{
                    await client.user.create({
                        data: {
                            email: user.email,
                            name: user.name,
                            password: "",
                            number: "",
                            auth_type: "Google"
                        }
                    })
                    return true;
                }
            }else if(account?.provider === "email"){
                
                if(user.verifiedPassword){
                    return true;
                }else{
                    return false;
                }
            }
        }   
    },
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    secret: process.env.NEXTAUTH_SECRET || "secret",
    pages: {
        signIn: "/signin",
        error: "/signin"
    }
}