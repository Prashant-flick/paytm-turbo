import db from "@repo/db/client"
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { AllTrasactions } from "../../../components/AllTransactions";

interface newSession {
    user?: {
        id?: string | null,
        name?: string | null,
        email?: string | null,
    }
}

async function getTransaction() {
    const session: newSession | null = await getServerSession(authOptions);
    const user = session?.user
    const txns = await db.onRampTransaction.findMany({ where: { userId: Number(session?.user?.id) } });
    const txns2 = await db.p2pTransfer.findMany({
        where: {
            OR:[
                {fromUserId: Number(user?.id)},
                {toUserId: Number(user?.id)}
            ]
        }
    });

    const newtxns = txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider,
        from: -1,
        to: -1
    }));

    const newtxns2 = txns2.map(t => ({
        time: t.timestamp,
        amount: t.amount,
        from: (t.fromUserId === Number(session?.user?.id) ? 1 : 0),
        to: (t.toUserId === Number(session?.user?.id) ? 1 : 0),
        provider: (t.fromUserId === Number(session?.user?.id) ? String(t.fromUserId) : String(t.toUserId)),
        status: ""
    }));

    const combinedTxns = [...newtxns, ...newtxns2];

    combinedTxns.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return combinedTxns;
}

export default async function() {
    const transactions = await getTransaction();    

    return <div className="h-screen w-screen">
        <h1 className="text-4xl text-[#6a50a5] pt-8 mb-8 font-bold">
            Trasactions
        </h1>
        <div className="min-w-[100px] pr-52 pl-40">
            <AllTrasactions transactions={transactions}/>
        </div>
    </div>
}