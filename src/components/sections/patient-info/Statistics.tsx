import { useTranslations } from "use-intl";
import Card from "../../containers/Card";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import "chartjs-adapter-date-fns";
import "chart.js/auto";
import {
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Title,
    Tooltip,
} from "chart.js";
import { request } from "../../../services/client/communication";
import Button from "../../buttons/Button";
import {
    DatedVector,
    mapAccelerationData,
    mapOrientationData,
} from "../../../services/mapper";
import { Activity } from "../../../types/dto/activity";
import { gradient } from "../../../services/evaluation";

export default function Statistics(): JSX.Element {
    const t = useTranslations("patient-info.statistics");

    const [loaded, setLoaded] = useState<boolean>(false);

    const [orientationData, setOrientationData] = useState<DatedVector[]>([]);
    const [accelerationData, setAccelerationData] = useState<DatedVector[]>([]);

    const CHART_OPTIONS: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
            },
        },
        elements: {
            line: {
                tension: 0.2,
                borderColor: [
                    "rgba(102,203,159,1.0)",
                    "rgba(104,219,242,1.0)",
                    "rgba(120,149,255,1.0)",
                    "rgba(241,96,99,1.0)",
                ],
                backgroundColor: [
                    "rgba(102,203,159,1.0)",
                    "rgba(104,219,242,1.0)",
                    "rgba(120,149,255,1.0)",
                    "rgba(241,96,99,1.0)",
                ],
            },
            point: {
                radius: 1,
            },
        },
        scales: {
            x: {
                type: "time",
                time: {
                    isoWeekday: true,
                    displayFormats: {
                        second: "dd/MM HH:mm:ss.SSS",
                    },
                    parser: "YYYY-MM-DDTHH:mm:ss.SSSZ",
                    unit: "second",
                },
            },
        },
    };

    useEffect(() => {
        if (!loaded) {
            // Initialize charts
            ChartJS.register(
                CategoryScale,
                LinearScale,
                TimeScale,
                PointElement,
                LineElement,
                Title,
                Tooltip,
                Legend,
                Filler,
            );

            // Retrieve data
            request("GET", "/api/activity", {}).then((result) => {
                if (result.status !== 200) {
                    setOrientationData([]);
                    setAccelerationData([]);
                } else {
                    const rawData = result.data as Activity[];
                    setOrientationData(mapOrientationData(rawData).reverse());
                    setAccelerationData(mapAccelerationData(rawData).reverse());
                }
                setLoaded(true);
                //setTimeout(() => setLoaded(false), 5000); // FIXME: temporary
            });
        }
    }, [loaded, setLoaded]);

    return (
        <div className="space-y-6">
            <div>
                <Button
                    size="medium"
                    type="regular"
                    colour="blue"
                    onClick={() => setLoaded(false)}
                    disabled={!loaded}
                >
                    {t("refresh")}
                </Button>
            </div>

            <Card title={t("orientation-history")} separator={true}>
                <div className={`p-4 ${loaded ? "h-96" : "min-h-80"}`}>
                    {loaded ? (
                        <Line
                            data={{
                                labels: orientationData?.map(
                                    (datedVector) => datedVector.date,
                                ),
                                datasets: [
                                    {
                                        label: "x",
                                        data: orientationData?.map(
                                            (datedVector) =>
                                                datedVector.vector.x,
                                        ),
                                    },
                                    {
                                        label: "y",
                                        data: orientationData?.map(
                                            (datedVector) =>
                                                datedVector.vector.y,
                                        ),
                                    },
                                    {
                                        label: "z",
                                        data: orientationData?.map(
                                            (datedVector) =>
                                                datedVector.vector.z,
                                        ),
                                    },
                                    {
                                        label: "10⁵.∑∇",
                                        data: gradient(orientationData)?.map(
                                            (gradient) =>
                                                (Math.abs(gradient.x!) +
                                                    Math.abs(gradient.y!) +
                                                    Math.abs(gradient.z!)) *
                                                10000,
                                        ),
                                    },
                                ],
                            }}
                            options={CHART_OPTIONS}
                        />
                    ) : (
                        <div className="w-full h-80 rounded-2lg bg-grey-200 animate-pulse"></div>
                    )}
                </div>
            </Card>

            <Card title={t("acceleration-history")} separator={true}>
                <div className={`p-4 ${loaded ? "h-96" : "min-h-80"}`}>
                    {loaded ? (
                        <Line
                            data={{
                                labels: accelerationData?.map(
                                    (datedVector) => datedVector.date,
                                ),
                                datasets: [
                                    {
                                        label: "x",
                                        data: accelerationData?.map(
                                            (datedVector) =>
                                                datedVector.vector.x,
                                        ),
                                    },
                                    {
                                        label: "y",
                                        data: accelerationData?.map(
                                            (datedVector) =>
                                                datedVector.vector.y,
                                        ),
                                    },
                                    {
                                        label: "z",
                                        data: accelerationData?.map(
                                            (datedVector) =>
                                                datedVector.vector.z,
                                        ),
                                    },
                                    {
                                        label: "10³.∑∇",
                                        data: gradient(accelerationData)?.map(
                                            (gradient) =>
                                                (Math.abs(gradient.x!) +
                                                    Math.abs(gradient.y!) +
                                                    Math.abs(gradient.z!)) *
                                                1000,
                                        ),
                                    },
                                ],
                            }}
                            options={CHART_OPTIONS}
                        />
                    ) : (
                        <div className="w-full h-80 rounded-2lg bg-grey-200 animate-pulse"></div>
                    )}
                </div>
            </Card>
        </div>
    );
}
