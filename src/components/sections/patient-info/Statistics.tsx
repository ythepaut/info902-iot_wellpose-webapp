import { useTranslations } from "use-intl";
import Card from "../../containers/Card";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import { request } from "../../../services/client/communication";
import Button from "../../buttons/Button";

interface ChartData {
    dateLabels: string[];
    values: number[];
}

export default function Statistics(): JSX.Element {
    const t = useTranslations("patient-info.statistics");
    const tr = useTranslations();

    const [loaded, setLoaded] = useState<boolean>(false);

    const [orientationData, setOrientationData] = useState<ChartData>();
    const [accelerationData, setAccelerationData] = useState<ChartData>();

    const CHART_OPTIONS = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
            },
        },
        elements: {
            line: {
                tension: 0.3,
                borderColor: [
                    "rgba(102,203,159,1.0)",
                    "rgba(104,219,242,1.0)",
                    "rgba(120,149,255,1.0)",
                ],
            },
        },
    };

    useEffect(() => {
        if (!loaded) {
            // Initialize charts
            ChartJS.register(
                CategoryScale,
                LinearScale,
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
                    setOrientationData({ dateLabels: [], values: [] });
                    setAccelerationData({ dateLabels: [], values: [] });
                } else {
                    const rawData = result.data;
                    setOrientationData({
                        dateLabels: rawData
                            .map((d: any) => d.dateEnd)
                            .map((date: string) =>
                                new Date(Date.parse(date)).toLocaleString(
                                    tr("general.dateFormat"),
                                ),
                            )
                            .reverse(),
                        values: rawData
                            .map((d: any) => d.orientation)
                            .reverse(),
                    });
                    setAccelerationData({ dateLabels: [], values: [] });
                }
                setLoaded(true);
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
                                labels: orientationData?.dateLabels,
                                datasets: [
                                    {
                                        label: "x",
                                        data: orientationData?.values.map(
                                            (v: any) => v.x,
                                        ),
                                    },
                                    {
                                        label: "y",
                                        data: orientationData?.values.map(
                                            (v: any) => v.y,
                                        ),
                                    },
                                    {
                                        label: "z",
                                        data: orientationData?.values.map(
                                            (v: any) => v.z,
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
                                labels: accelerationData?.dateLabels,
                                datasets: [
                                    {
                                        label: "x",
                                        data: accelerationData?.values.map(
                                            (v: any) => v.x,
                                        ),
                                    },
                                    {
                                        label: "y",
                                        data: accelerationData?.values.map(
                                            (v: any) => v.y,
                                        ),
                                    },
                                    {
                                        label: "z",
                                        data: accelerationData?.values.map(
                                            (v: any) => v.z,
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
