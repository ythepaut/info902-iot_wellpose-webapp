import { Db } from "mongodb";
import { ACTIVITY_COLLECTION_NAME } from "../../types/dto/activity";
import { Activity } from "../../types/dto/activity";

export async function getActivityLevel(db: Db): Promise<number> {
    let activities = await db
        .collection(ACTIVITY_COLLECTION_NAME)
        .find({
            dateFrom: {
                $gte: new Date(Date.now() - 1000 * 30),
            },
        })
        .toArray();

    const len = activities.filter(
        (activity) => activity.accelerations.length !== 0,
    ).length;

    return len === 0 ? 1 : 0;
}
