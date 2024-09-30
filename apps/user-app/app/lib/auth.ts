import client from "@repo/db/client"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import GoogleProvider from "next-auth/providers/google";
import { Account, NextAuthOptions, User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

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
                        return existingUser
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

                        return res
                    }else{
                        throw new Error("user doesn't exist")
                    }
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    callbacks: {
        async session({token, session}: {token: JWT, session: Session}): Promise<Session>{            
            session.user.name = token.name
            session.user.email = token.email
            session.user.id = token.sub
            return session
        },
        async jwt({token, user}: {token: JWT, user: User | AdapterUser}){
            console.log(user);
            console.log(token);
            
            if (user) {
                token.name = user.name;
                token.email = user.email
                token.sub = user.id
            }
            return token;
        },
        async redirect({ baseUrl }: {baseUrl: string}) {
            return baseUrl
        },
        async signIn({
            user,account
        }: { user: User | AdapterUser, account: Account | null }): Promise<string | boolean>{            
            if(account?.provider === "google"){
                const existingUser = await client.user.findFirst({
                    where: {
                        email : user.email as string
                    }
                })
                if(existingUser){
                    return true;
                }else{
                    await client.user.create({
                        data: {
                            email: user.email as string,
                            name: user.name as string,
                            password: "",
                            number: "",
                            auth_type: "Google"
                        }
                    })
                    return true;
                }
            }else if(account?.provider === "email"){
                return true;
            }
            return false;
        }   
    },
    secret: process.env.NEXTAUTH_SECRET || "secret",
    pages: {
        signIn: "/signin",
        error: "/signin"
    }
}