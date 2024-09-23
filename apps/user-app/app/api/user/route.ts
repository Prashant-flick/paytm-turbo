import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

export const GET = async() => {    
    const session = await getServerSession(authOptions);
    if(session?.user){
        return NextResponse.json({
            user: session.user
        })
    }

    return NextResponse.json({
        message: "you are not logged in"
    }),{
        status: 403
    }
}