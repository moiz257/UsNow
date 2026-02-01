import './globals.css'

export const metadata = {
  title: 'UsNow | Trusted Identity Layer',
  description: 'The quiet, trusted update layer between you and the companies you interact with.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
