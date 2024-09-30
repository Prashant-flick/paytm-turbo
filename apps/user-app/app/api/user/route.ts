import { NextResponse } from "next/server";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../../lib/auth";

export const GET = async () => {    
    const session: Session | null = await getServerSession(authOptions);
    const user = session?.user
    if (user) {
        return NextResponse.json({
            user: user
        });
    }

    return NextResponse.json(
        {
            user: {
                message: "user not found"
            }
        },
        {
            status: 403
        }
    );
};
