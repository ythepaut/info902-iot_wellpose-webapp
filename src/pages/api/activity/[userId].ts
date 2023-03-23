import {
    Body,
    createHandler,
    Get,
    Post,
    ValidationPipe,
} from "next-api-decorators";
import {
    ACTIVITY_COLLECTION_NAME,
    CreateActivityDTO,
} from "../../../types/dto/activity";
import clientPromise from "../../../services/server/mongodb";

class ActivityHandler {
    @Get()
    getActivity() {
        return [];
    }

    @Post()
    createActivity(@Body(ValidationPipe) body: CreateActivityDTO) {
        return new Promise(async (resolve) => {
            let db = (await clientPromise).db("INFO902");
            await db.collection(ACTIVITY_COLLECTION_NAME).insertOne(body);
            resolve(null);
        });
    }
}

export default createHandler(ActivityHandler);
