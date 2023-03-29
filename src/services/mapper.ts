import { Activity, Vector } from "../types/dto/activity";

export interface DatedVector {
    date: Date;
    vector: Vector;
}

export const mapOrientationData = (activityList: Activity[]): DatedVector[] => {
    return activityList.map((activity) => ({
        date: new Date(Date.parse(activity.dateEnd as unknown as string)),
        vector: activity.orientation,
    }));
};

export const mapAccelerationData = (
    activityList: Activity[],
): DatedVector[] => {
    return activityList
        .flatMap((activity) =>
            activity.accelerations.map((acceleration) => ({
                date: new Date(
                    Date.parse(activity.dateStart as unknown as string) +
                        Math.floor(acceleration.dt!),
                ),
                vector: acceleration.acceleration!,
            })),
        )
        .sort((a, b) => (a.date.getTime() > b.date.getTime() ? 1 : 0));
};
