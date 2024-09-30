import { Button } from "@repo/ui/button";
import { getServerSession, Session } from "next-auth";

export default async function Home() {
  const session: Session | null = await getServerSession();

  return (
    <div className="bg-black h-screen text-white text-3xl font-extrabold flex-row">
      merchant app
      <Button>
        Hello
      </Button>
      {JSON.stringify(session)}
    </div>
  );
}
