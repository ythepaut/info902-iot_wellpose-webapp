import { DatedVector } from "./mapper";
import { Vector } from "../types/dto/activity";

export const gradient = (datedVectors: DatedVector[]): DatedVector[] => {
    return datedVectors.slice(1).map((currentVector, index) => {
        const previousVector = datedVectors[index];
        return {
            date: previousVector.date,
            vector: {
                x:
                    (currentVector.vector.x! - previousVector.vector.x!) /
                    (currentVector.date.getTime() -
                        previousVector.date.getTime()),
                y:
                    (currentVector.vector.y! - previousVector.vector.y!) /
                    (currentVector.date.getTime() -
                        previousVector.date.getTime()),
                z:
                    (currentVector.vector.z! - previousVector.vector.z!) /
                    (currentVector.date.getTime() -
                        previousVector.date.getTime()),
            },
        };
    });
};

export const gradientOverPeriod = (
    gradient: DatedVector[],
    dateFrom?: Date,
    dateTo?: Date,
): DatedVector[] => {
    if (!dateTo || !dateFrom) return [];
    return gradient.filter(
        (datedVector) =>
            datedVector.date.getTime() > dateFrom.getTime() &&
            datedVector.date.getTime() < dateTo.getTime(),
    );
};

export const gradientNormSum = (gradient: DatedVector[]) => {
    const norm = (vector: Vector): number =>
        Math.sqrt(vector.x! ^ (2 + vector.y!) ^ (2 + vector.z!) ^ 2);
    return gradient.reduce(
        (accumulator, currentValue) => accumulator + norm(currentValue.vector),
        0,
    );
};
