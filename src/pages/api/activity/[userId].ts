import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../services/server/mongodb";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    return new Promise(async (resolve) => {
        if (req.method === "POST") {
            // Add new activity
            res.status(200).json({ method: "POST" });
            resolve({});
        } else if (req.method === "GET") {
            // Get activity list

            let db = (await clientPromise).db("INFO902");

            res.status(200).json({ database: db.databaseName });
            resolve({});
        } else {
            res.status(400).end();
            resolve({});
        }
    });
}
