import {
    BadRequestException,
    Body,
    createHandler,
    Get,
    HttpCode,
    ParseDatePipe,
    ParseNumberPipe,
    Post,
    Query,
    ValidationPipe,
} from "next-api-decorators";
import { getActivityLevel } from "../../services/server/userActivity";
import {
    Activity,
    ACTIVITY_COLLECTION_NAME,
    CreateActivityDTO,
} from "../../types/dto/activity";
import clientPromise from "../../services/server/mongodb";
import getConfig from "next/config";

class ActivityHandler {
    @Get()
    @HttpCode(200)
    getActivity(
        @Query("dateForm", ParseDatePipe({ nullable: true }))
        queryDateFrom?: Date,
        @Query("dateTo", ParseDatePipe({ nullable: true })) queryDateTo?: Date,
        @Query("limit", ParseNumberPipe({ nullable: true }))
        queryLimit?: number,
        @Query("page", ParseNumberPipe({ nullable: true })) queryPage?: number,
    ) {
        const { serverRuntimeConfig } = getConfig();

        const dateFrom = queryDateFrom ?? new Date(0);
        const dateTo = queryDateTo ?? new Date(8640000000000000); // latest possible date ((2^63-1) / 2)
        const limit = queryLimit ?? 100;
        const page = queryPage ?? 1;

        if (limit < 1) throw new BadRequestException("Limit must be >= 1");
        if (page < 1) throw new BadRequestException("Page must be >= 1");

        return new Promise(async (resolve) => {
            let db = (await clientPromise).db(
                serverRuntimeConfig.mongodbDatabase,
            );
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
            resolve(results);
        });
    }

    @Post()
    @HttpCode(201)
    createActivity(@Body(ValidationPipe) body: CreateActivityDTO) {
        const { serverRuntimeConfig } = getConfig();

        return new Promise(async (resolve) => {
            let db = (await clientPromise).db(
                serverRuntimeConfig.mongodbDatabase,
            );
            const activity: Activity = {
                dateStart: new Date(Date.now()),
                dateEnd: new Date(Date.now() - body.duration!),
                accelerations: body.accelerations!.map((a) => ({
                    acceleration: {
                        x: a.acceleration!.x,
                        y: a.acceleration!.y,
                        z: a.acceleration!.z,
                    },
                    dt: a.dt,
                })),
                orientation: body.orientation!,
            };

            await db.collection(ACTIVITY_COLLECTION_NAME).insertOne(activity);
            resolve({
                level: await getActivityLevel(db),
            });
        });
    }
}

export default createHandler(ActivityHandler);
