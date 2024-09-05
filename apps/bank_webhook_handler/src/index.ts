import express from "express";
import client from "@repo/db/client"

const app = express()

app.use(express.json())

app.post("/hdfcWebHook", async (req, res) => {
    
    const paymentInformation: {
        token: string,
        userId: string,
        amount: string
    } = {
        token : req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    }    

    const statusOnRamp = await client.onRampTransaction.findFirst({
        where: {
            token: paymentInformation.token
        }
    })

    if(statusOnRamp?.status === "Processing"){
        try {
            await client.$transaction([
                client.balance.update({
                    where: {
                        userId: Number(paymentInformation.userId)
                    },
                    data: {
                        amount: {
                            increment: Number(paymentInformation.amount)
                        }
                    }
                }),
                client.onRampTransaction.update({
                    where: {
                        token: paymentInformation.token
                    },
                    data: {
                        status: "Success"
                    }
                })
            ]);
            res.status(200)
            .json({
                message: "captured"
            })
        } catch (error) {
            console.log(error);
            res.status(411)
            .json({
                message: "error while processing webhook"
            })
        }
    }else{
        res.status(400)
        .json({
            message: "the transaction has already done"
        })
    }

    
})

app.listen(3003, ()=> {
    console.log("server running on 3003");
});