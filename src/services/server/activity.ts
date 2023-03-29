import {
    Activity,
    ACTIVITY_COLLECTION_NAME,
    CreateActivityDTO,
} from "../../types/dto/activity";
import clientPromise from "./mongodb";
import getConfig from "next/config";

export const getActivityList = (
    page: number,
    limit: number,
    dateFrom: Date | null,
    dateTo: Date | null,
): Promise<Activity[]> => {
    const { serverRuntimeConfig } = getConfig();
    return new Promise(async (resolve) => {
        let db = (await clientPromise).db(serverRuntimeConfig.mongodbDatabase);
        let results = await db
            .collection(ACTIVITY_COLLECTION_NAME)
            .find({
                //dateFrom: { $gte: dateFrom, $lte: dateTo },
            })
            .sort({ dateStart: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .map((activity) => ({ ...activity, _id: undefined }))
            .toArray();
        resolve(results as unknown as Activity[]);
    });
};

export const createNewActivity = (
    activityDto: CreateActivityDTO,
): Promise<void> => {
    const { serverRuntimeConfig } = getConfig();

    return new Promise(async (resolve) => {
        let db = (await clientPromise).db(serverRuntimeConfig.mongodbDatabase);
        const activity: Activity = {
            dateStart: new Date(Date.now()),
            dateEnd: new Date(Date.now() - activityDto.duration!),
            accelerations: activityDto.accelerations!.map((a) => ({
                acceleration: {
                    x: a.acceleration!.x,
                    y: a.acceleration!.y,
                    z: a.acceleration!.z,
                },
                dt: a.dt,
            })),
            orientation: activityDto.orientation!,
        };
        await db.collection(ACTIVITY_COLLECTION_NAME).insertOne(activity);
        resolve();
    });
};
