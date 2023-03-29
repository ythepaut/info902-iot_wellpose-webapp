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
import { CreateActivityDTO } from "../../../types/dto/activity";
import {
    createNewActivity,
    getActivityList,
} from "../../../services/server/activity";

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
        const dateFrom = queryDateFrom ?? new Date(0);
        const dateTo = queryDateTo ?? new Date(8640000000000000); // latest possible date ((2^63-1) / 2)
        const limit = queryLimit ?? 100;
        const page = queryPage ?? 1;

        if (limit < 1) throw new BadRequestException("Limit must be >= 1");
        if (page < 1) throw new BadRequestException("Page must be >= 1");

        return getActivityList(page, limit, dateFrom, dateTo);
    }

    @Post()
    @HttpCode(201)
    createActivity(@Body(ValidationPipe) body: CreateActivityDTO) {
        return new Promise(async (resolve) => {
            await createNewActivity(body);
            resolve({});
        });
    }
}

export default createHandler(ActivityHandler);
