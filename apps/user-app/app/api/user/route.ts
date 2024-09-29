import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

interface newSession {
    user?: {
        id?: string | null,
        name?: string | null,
        email?: string | null,
    }
}

export const GET = async () => {    
    const session: newSession | null = await getServerSession(authOptions);
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
