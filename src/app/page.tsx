import Image from "next/image";
import { Button } from "@nextui-org/react";
import { auth, signIn, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        <form action={ async () => {
          "use server"
          await signIn('github')
        }}>
          <Button type="submit">Log in with Github</Button>
        </form>
        <form action={ async () => {
          "use server"
          await signIn()
        }}>
          <Button type="submit">Log in with email</Button>
        </form>
        <form action={ async () => {
          "use server"
          await signOut()
        }}>
          <Button type="submit">Log Out</Button>
        </form>

        { session?.user ? <div>{JSON.stringify(session.user)}</div> : <div>Signed Out</div>}
      </div>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <div className="flex gap-4 items-center flex-col sm:flex-row">

        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
