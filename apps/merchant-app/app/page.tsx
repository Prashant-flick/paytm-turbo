import { Button } from "@repo/ui/button";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();
  return (
    <div className="bg-black h-screen text-white text-3xl font-extrabold flex-row">
      merchant app
      <Button appName="btn">
        Hello
      </Button>
      {JSON.stringify(session)}
    </div>
  );
}
