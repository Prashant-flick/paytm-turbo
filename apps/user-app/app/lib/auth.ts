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
                console.log("authorizing");
                const existingUser = await client.user.findFirst({
                    where: {
                        email: credentials.email
                    }
                });


                if(existingUser){
                    console.log("existing user");
                    console.log(existingUser);
                    
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password)                    
                    if(passwordValidation){                        
                        return {
                            verifiedPassword: true,
                            name: existingUser.name,
                            email: existingUser.email,
                            number: existingUser.number
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
                            }
                        })

                        return {
                            name: res.name,
                            email: res.email,
                            number: res.number,
                            verifiedPassword: true
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
        async session({token, session, user}: any){
            console.log("creatign session");
            console.log(session);
            console.log(token);
            console.log(user);
            
            session.user.id = token.sub
            return session
        },
        async redirect({ baseUrl }: any) {
            return baseUrl
        },
        async signIn({user,account}: any): Promise<any>{
            console.log("sign in session");
            console.log(account);
            
            if(account?.provider === "google"){
                const existingUser = await client.user.findFirst({
                    where: {
                        email : user.email
                    }
                })
                if(existingUser){
                    console.log("existing google user");
                    return true;
                }else{
                    console.log("new google user");
                    const res = await client.user.create({
                        data: {
                            email: user.email,
                            name: user.name,
                            password: "",
                            number: "",
                            auth_type: "Google"
                        }
                    })
                    console.log(res);
                    console.log("user created");
                    return true;
                }
            }else if(account?.provider === "email"){
                console.log("credentials provider");
                
                if(user.verifiedPassword){
                    console.log("user verified");
                    return true;
                }else{
                    console.log("not vaid password");
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