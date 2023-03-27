import { IsDecimal, IsInt, IsNotEmpty } from "class-validator";

export const ACTIVITY_COLLECTION_NAME = "activity_history";

export interface Activity {
    dateStart: Date;
    dateEnd: Date;
    accelerations: AccelerationSample[];
    orientation: Vector;
}

export class Vector {
    @IsNotEmpty()
    @IsDecimal()
    x?: number;

    @IsNotEmpty()
    @IsDecimal()
    y?: number;

    @IsNotEmpty()
    @IsDecimal()
    z?: number;
}

export class AccelerationSample {
    @IsNotEmpty()
    @IsDecimal()
    dt?: number;

    @IsNotEmpty()
    acceleration?: Vector;
}

export class CreateActivityDTO {
    @IsNotEmpty()
    @IsInt()
    duration?: number;

    @IsNotEmpty()
    accelerations?: AccelerationSample[];

    @IsNotEmpty()
    orientation?: Vector;
}
