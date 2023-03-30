import React, { forwardRef, Ref, useImperativeHandle, useState } from "react";
import Button from "./buttons/Button";
import { Heading3 } from "./text/Headings";
import {
    faAngleLeft,
    faAngleRight,
    faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "use-intl";

interface Props {
    initialDate?: Date;
    classFromDate?: (date: Date) => string;
}

export interface CalendarRef {
    getWeek: () => Date[];
}

const Calendar = forwardRef((props: Props, ref: Ref<CalendarRef>) => {
    const t = useTranslations("calendar");

    const [currentDate, setCurrentDate] = useState(
        props.initialDate ?? new Date(),
    );
    const daysOfWeek = [
        t("monday"),
        t("tuesday"),
        t("wednesday"),
        t("thursday"),
        t("friday"),
        t("saturday"),
        t("sunday"),
    ];

    useImperativeHandle(ref, () => ({
        getWeek() {
            return week;
        },
    }));

    const generateWeek = (): Date[] => {
        const week = [];
        const today = currentDate.getDay();
        const startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - (today === 0 ? 6 : today - 1),
        );

        for (let i = 0; i < 7; i++) {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);
            week.push(day);
        }

        return week;
    };

    const prevWeek = () => {
        setCurrentDate(
            (prevDate) => new Date(prevDate.setDate(prevDate.getDate() - 7)),
        );
    };

    const currentWeek = () => {
        setCurrentDate((_) => new Date());
    };

    const nextWeek = () => {
        setCurrentDate(
            (prevDate) => new Date(prevDate.setDate(prevDate.getDate() + 7)),
        );
    };

    const week: Date[] = generateWeek();

    const hoursPerDay = (): Date[] => {
        const table: Date[] = [];
        let currentDate = week[0];
        currentDate.setHours(0, 0, 0, 0);

        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 7; j++) {
                currentDate = week[j];
                currentDate.setHours(i);
                table.push(new Date(currentDate));
            }
        }
        return table;
    };

    return (
        <div className="w-full space-y-2">
            <div className="flex">
                <div className="w-1/2 capitalize">
                    <Heading3>
                        {new Intl.DateTimeFormat(t("locale"), {
                            month: "long",
                            year: "numeric",
                        }).format(week[0])}
                    </Heading3>
                </div>
                <div className="w-1/2 flex justify-end mb-4 space-x-4">
                    <Button
                        size="small"
                        type="regular"
                        colour="blue"
                        onClick={prevWeek}
                    >
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </Button>
                    <Button
                        size="small"
                        type="regular"
                        colour="blue"
                        onClick={currentWeek}
                    >
                        <FontAwesomeIcon icon={faCalendarDay} />
                    </Button>
                    <Button
                        size="small"
                        type="regular"
                        colour="blue"
                        onClick={nextWeek}
                    >
                        <FontAwesomeIcon icon={faAngleRight} />
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-7 w-full bg-grey-200 rounded-2lg">
                {week.map((day, index) => (
                    <div key={index} className="text-center py-4 space-x-4">
                        <span className="font-bold">
                            {daysOfWeek[(day.getDay() + 6) % 7]}
                        </span>
                        <span>{day.getDate()}</span>
                    </div>
                ))}
                {hoursPerDay().map((date, index) => (
                    <div
                        className={`${
                            props.classFromDate
                                ? props.classFromDate(date)
                                : "bg-white"
                        } h-6 p-2 border-1 border-grey-200 text-txt-body-lightmuted font-mono text-3xs`}
                        key={index}
                    >
                        {index % 7 === 0
                            ? date.toLocaleTimeString().slice(0, 5)
                            : ""}
                    </div>
                ))}
            </div>
        </div>
    );
});

Calendar.displayName = "Calendar";
export default Calendar;
