import { useTranslations } from "use-intl";
import Calendar, { CalendarRef } from "../../Calendar";
import { useEffect, useRef, useState } from "react";
import { request } from "../../../services/client/communication";
import { Activity } from "../../../types/dto/activity";
import { DatedVector, mapOrientationData } from "../../../services/mapper";
import {
    gradient,
    gradientNormSum,
    gradientOverPeriod,
} from "../../../services/evaluation";

export default function ActivitySection(): JSX.Element {
    const t = useTranslations("patient-info.activity");

    const [loaded, setLoaded] = useState<boolean>(false);
    const calendarRef = useRef<CalendarRef>(null);

    const [weekGradient, setWeekGradient] = useState<DatedVector[]>([]);

    useEffect(() => {
        // Retrieve data
        request("GET", "/api/activity", {}).then((result) => {
            if (result.status === 200) {
                const activity = result.data as Activity[];
                const orientationGradient = gradientOverPeriod(
                    gradient(mapOrientationData(activity)),
                    calendarRef.current?.getWeek()[0],
                    calendarRef.current?.getWeek()[6],
                );
                const accelerationGradient = gradientOverPeriod(
                    gradient(mapOrientationData(activity)),
                    calendarRef.current?.getWeek()[0],
                    calendarRef.current?.getWeek()[6],
                );
                setWeekGradient(
                    orientationGradient.concat(accelerationGradient),
                );
            }
            setLoaded(true);
        });
    }, [loaded, setLoaded]);

    const dateToColourClass = (date: Date): string => {
        if (!loaded) return "bg-grey-200 animate-pulse";
        const dateTo = date.getTime() + 3600000;
        const gradient = gradientOverPeriod(
            weekGradient,
            date,
            new Date(dateTo),
        );
        const normSum = gradientNormSum(gradient);
        if (normSum > 100) return "bg-green";
        else if (normSum > 50) return "bg-green-light";
        else if (normSum > 0) return "bg-green-soft";
        return "bg-white";
    };

    return (
        <>
            <Calendar classFromDate={dateToColourClass} ref={calendarRef} />
        </>
    );
}
