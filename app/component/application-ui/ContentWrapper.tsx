export default function ContentWrapper({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-white p-5 rounded-md">{children}</div>;
}
