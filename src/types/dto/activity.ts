import {
    IsArray,
    IsDate,
    IsDecimal,
    IsNotEmpty,
    IsNumber,
} from "class-validator";

export const ACTIVITY_COLLECTION_NAME = "activity_history";

export class CreateActivityDTO {
    @IsNotEmpty()
    @IsDate()
    dateFrom?: Date;

    @IsNotEmpty()
    @IsDate()
    dateTo?: Date;

    @IsNotEmpty()
    @IsNumber()
    meanAcceleration?: number;

    @IsNotEmpty()
    @IsNumber({}, { each: true })
    meanOrientation?: number[];
}
