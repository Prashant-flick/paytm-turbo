"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textInp";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
import { error } from "console";

export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");

    return <div className="w-full">
        <Card title="Send">
            <div className="min-w-72 pt-2">
                <TextInput placeholder={"Number"} value={number} label="Number" onChange={(value) => {
                    setNumber(value)
                }} />
                <TextInput placeholder={"Amount"} value={amount} label="Amount" onChange={(value) => {
                    setAmount(value)
                }} />
                <div className="pt-4 flex justify-center">
                    <Button onClick={async() => {
                        const data = await p2pTransfer(number, Number(amount)*100)
                        if(data?.message === "transfer done"){
                            window.location.reload()
                        }else{
                            throw error(data?.message)
                        }
                    }}>Send</Button>
                </div>
            </div>
        </Card>
    </div>
}