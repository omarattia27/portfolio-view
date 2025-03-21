import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: "Not Authenticated" });
    }

    res.status(200).json({ session });
}
