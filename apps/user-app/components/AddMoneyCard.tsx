"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textInp";
import { createOnRampTransactions } from "../app/lib/actions/createOnRampTransaction";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}];

export const AddMoney = () => {
    const [redirectUrl, setRedirectUrl] = useState<string>(SUPPORTED_BANKS[0]?.redirectUrl||"");
    const [amount, setAmount] = useState<string>("0")
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
                    // window.location.href = redirectUrl || "";
                    await createOnRampTransactions(bankName, amount)
                }}>
                Add Money
                </Button>
            </div>
        </div>
        </Card>
    )
}