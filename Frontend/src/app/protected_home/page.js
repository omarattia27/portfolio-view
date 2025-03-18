import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>Access Denied. Please <a href="/login">Login</a>.</p>;
  }

  return <h1>Welcome, {session.user.name}!</h1>;
}
