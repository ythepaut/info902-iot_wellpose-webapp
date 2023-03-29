import { getActivityList } from "./activity";

export async function getActivityLevel(): Promise<number> {
    let activities = await getActivityList(1, 5, null, null);

    return activities.filter((activity) => activity.accelerations.length !== 0)
        .length === 0
        ? 1
        : 0;
}
