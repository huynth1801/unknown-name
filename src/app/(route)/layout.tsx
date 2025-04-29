import Footer from "@/components/footer/footer"
import Header from "@/components/headers/headers"
import { Fragment } from "react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Fragment>
      <Header />
      <div className="px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
        {children}
      </div>
      <Footer />
    </Fragment>
  )
}
