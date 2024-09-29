import { Button } from "@repo/ui/button";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();

  const handleOnClick = () => {
    console.log("hello");
  }

  return (
    <div className="bg-black h-screen text-white text-3xl font-extrabold flex-row">
      merchant app
      <Button onClick={handleOnClick}>
        Hello
      </Button>
      {JSON.stringify(session)}
    </div>
  );
}
