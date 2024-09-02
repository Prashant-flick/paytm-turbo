"use server"
import client from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"

export async function createOnRampTransactions(provider: string, amount: string){
    const session = await getServerSession(authOptions);    

    console.log("createOnRampTransactions");
    console.log(provider);
    console.log(amount);
    console.log(session);

    if(!session?.user || !session?.user?.id){
        return {
            message: "Unauthenticated request"
        }
    }

    const token = (Math.random() * 10000).toString()
    const res = await client.onRampTransaction.create({
        data: {
            userId: Number(session?.user?.id),
            amount: Number(amount),
            status: "Processing",
            token: token,
            provider: provider,
            startTime: new Date()
        }
    })

    if(res){
        return {
            message : "Captured"
        }
    }else{
        return {
            message : "onRampTransaction Creation Failed"
        }
    }
    
}