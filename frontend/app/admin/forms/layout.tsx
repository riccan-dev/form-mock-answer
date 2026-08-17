export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container-fluid py-4" style={{ maxWidth: 800 }}>
      <div className="card">{children}</div>
    </div>
  );
}
