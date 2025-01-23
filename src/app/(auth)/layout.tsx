export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white">
      {children}
    </div>
  )
}
