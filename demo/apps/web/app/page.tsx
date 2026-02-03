"use client";

import { Button } from "@repo/ui/button/button";
import { useSession, signIn, signUp, signOut } from "@web/libs/auth-client";
import Landing from "./to-delete/landing";
export default function Home() {
  const {
    data: session,
  } = useSession()

  return <Landing />
  // return <><Button onClick={() => {
  //   signIn.email({
  //     email: "user0.05997400857808177@example.com",
  //     password: "password123",
  //   });
  // }}>Sign In</Button>
  //   <Button onClick={() => {
  //     const randomName = `user${Math.random()}`;
  //     signUp.email({
  //       name: randomName,
  //       email: `${randomName}@example.com`,
  //       password: "password123",
  //     });
  //   }}>Sign Up</Button>
  //   <Button onClick={() => {
  //     signOut();
  //   }}>Sign Out</Button>
  //   <pre>{JSON.stringify(session, null, 2)}</pre>
  // </>
}
