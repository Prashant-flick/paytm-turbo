"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textInp";
import { createOnRampTransactions } from "../app/lib/actions/createOnRampTransaction";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "http://hdfc.jackbythehedge.co.uk/HDFC/addMoneyToWallet"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}];

export const AddMoney = () => {
    const [redirectUrl, setRedirectUrl] = useState<string>(SUPPORTED_BANKS[0]?.redirectUrl||"");
    const [amount, setAmount] = useState<string>("")
    const [bankName, setBankName] = useState<string>(SUPPORTED_BANKS[0]?.name||"")

    return (
        <Card title="Add Money">
        <div className="w-full">
            <TextInput value={String(amount)} label={"Amount"} placeholder={"Amount"} onChange={(value) => {
                setAmount(value)
            }} />
            <div className="py-4 text-left">
                Bank
            </div>
            <Select onSelect={(value) => {
                setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "")
                setBankName(SUPPORTED_BANKS.find(x => x.name === value)?.name || "")
            }} options={SUPPORTED_BANKS.map(x => ({
                key: x.name,
                value: x.name
            }))} />
            <div className="flex justify-center pt-4">
                <Button onClick={async() => {
                    const res = await createOnRampTransactions(bankName, amount+'00', redirectUrl)
                    window.location.href = res?.url || '/'
                }}>
                Add Money
                </Button>
            </div>
        </div>
        </Card>
    )
}