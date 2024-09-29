import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

interface User {
    id?: string | null,
    name?: string | null,
    email?: string | null,
}

export const GET = async () => {    
    const session = await getServerSession(authOptions);
    const user: User | undefined = session?.user
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
