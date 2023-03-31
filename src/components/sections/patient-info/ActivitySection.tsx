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
import Button from "../../buttons/Button";

export default function ActivitySection(): JSX.Element {
    const t = useTranslations("patient-info.activity");

    const [loaded, setLoaded] = useState<boolean>(false);
    const calendarRef = useRef<CalendarRef>(null);

    const [weekGradient, setWeekGradient] = useState<DatedVector[]>([]);

    useEffect(() => {
        if (!loaded) {
            setLoaded(true);

            request("GET", "/api/activity?limit=1000000", {}).then((result) => {
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
            });
        }
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
        if (normSum > 1500) return "bg-green";
        else if (normSum > 750) return "bg-green-light";
        else if (normSum > 0) return "bg-green-soft";
        return "bg-white";
    };

    return (
        <div className="space-y-6">
            <Button
                size="medium"
                type="regular"
                colour="blue"
                onClick={() => setLoaded(false)}
                disabled={!loaded}
            >
                {t("refresh")}
            </Button>
            <Calendar classFromDate={dateToColourClass} ref={calendarRef} />
        </div>
    );
}
