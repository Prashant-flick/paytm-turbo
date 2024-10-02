"use server"
import { getServerSession, Session } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client"

export async function p2pTransfer(to: string, amount: number){
    const session: Session | null = await getServerSession(authOptions)
    const user = session?.user
    const from = user?.id

    if(!from){
        return {
            message: "User not logged in"
        }
    }

    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    })
    if(!toUser){
        return {
            message: "User not found"
        }
    }

    
    await prisma.$transaction(async (tx) => {
        tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId"=${Number(from)} FOR UPDATE`

        const fromBalance = await tx.balance.findUnique({
            where: {
                userId: Number(from)
            }
        })

        if(!fromBalance || fromBalance?.amount<amount){
            return {
                message: "Insufficient fund"
            }
        }

        await tx.balance.update({
            where: {
                userId: Number(from)
            },
            data: {
                amount : {
                    decrement: amount 
                }
            }
        })

        await tx.balance.update({
            where: {
                id: Number(toUser.id)
            },
            data: {
                amount : {
                    increment: amount 
                }
            }
        })

        await tx.p2pTransfer.create({
            data: {
                fromUserId: Number(from),
                toUserId: Number(toUser.id),
                amount: amount,
                timestamp: new Date()
            }
        })
    })

    return {
        message : "transfer done"
    }
}