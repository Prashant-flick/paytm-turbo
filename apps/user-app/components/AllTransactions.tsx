import { Card } from "@repo/ui/card"

export const AllTrasactions = ({
    transactions
} : {
    transactions: {
        time: Date,
        amount: number,
        status: string,
        provider: string,
        from: number,
        to: number
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }

    return <Card title="Recent Transactions">
        <div className="pt-2">
            {transactions.map((t, index) => {
                
                return (
                    <div key={index} className="flex justify-between">
                        
                        {t.status!=='' ?
                            <>
                                <div>
                                    <div className="text-sm">
                                        {t.status==="Success"?`Received INR from ${t.provider}`:"Failed"}
                                    </div>
                                    <div className="text-slate-600 text-xs">
                                        {t.time.toDateString()}
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    + Rs {t.amount / 100}
                                </div>
                            </>
                            :
                            <>
                                <div>
                                    <div className="text-sm">
                                        {t.from===0 ? `Received INR from ${t.provider}` : `Sent INR to ${t.provider}`}
                                    </div>
                                    <div className="text-slate-600 text-xs">
                                        {t.time.toDateString()}
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    {t.from===0 ? `+ Rs ${t.amount / 100}` : `- Rs ${t.amount / 100}`}
                                </div>
                            </>
                        }
                    </div>
                )
            })}
        </div>
    </Card>
}