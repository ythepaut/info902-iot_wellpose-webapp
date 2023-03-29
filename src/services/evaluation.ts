import { DatedVector } from "./mapper";
import { Vector } from "../types/dto/activity";

export const gradient = (datedVectors: DatedVector[]): Vector[] => {
    return datedVectors.slice(1).map((currentVector, index) => {
        const previousVector = datedVectors[index];
        return {
            x:
                (currentVector.vector.x! - previousVector.vector.x!) /
                (currentVector.date.getTime() - previousVector.date.getTime()),
            y:
                (currentVector.vector.y! - previousVector.vector.y!) /
                (currentVector.date.getTime() - previousVector.date.getTime()),
            z:
                (currentVector.vector.z! - previousVector.vector.z!) /
                (currentVector.date.getTime() - previousVector.date.getTime()),
        };
    });
};
