import { UserButton } from "@clerk/nextjs";

export default function Dashboard() {
  return (
    <div className="p-4">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
