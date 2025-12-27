import PrivateHeader from "@/components/layout/PrivateHeader";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PrivateHeader />
      {children}
    </>
  )
}
