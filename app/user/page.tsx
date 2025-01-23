import { redirect } from "next/navigation";

// import { Main } from "@/components/layout/Main";
// import { Header } from "@/components/layout/Header";

export default async function Page() {
  redirect("/user/tour");
  /*
  return (
    <Main>
      <Header text="Dashboard" />
    </Main>
  );
  */
}
