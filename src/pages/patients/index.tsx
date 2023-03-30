import { GetStaticProps } from "next";
import Header from "../../components/layout/Header";
import Navbar from "../../components/navigation/navbar/Navbar";
import { useTranslations } from "use-intl";
import Breadcrumb from "../../components/navigation/breadcrumb/Breadcrumb";
import Tabs from "../../components/containers/Tabs";
import ActivitySection from "../../components/sections/patient-info/ActivitySection";
import StatisticsSection from "../../components/sections/patient-info/StatisticsSection";

export default function PatientInfo(): JSX.Element {
    const t = useTranslations();

    return (
        <div className="flex bg-bg-light">
            <Navbar />
            <div className="w-10/12 fixed top-0 right-0 overflow-y-auto max-h-screen">
                <Header
                    title={`${t.rich("patient-info.title", {
                        name: "Jean DUPONT",
                    })}`}
                >
                    <Breadcrumb
                        items={[
                            {
                                title: t("patient-list.title"),
                                action: () => {},
                            },
                            { title: "Jean DUPONT" },
                        ]}
                    />
                </Header>
                <div className="px-10 py-6">
                    <Tabs
                        tabs={[
                            {
                                child: <ActivitySection />,
                                name: t("patient-info.activity.title"),
                            },
                            {
                                child: <StatisticsSection />,
                                name: t("patient-info.statistics.title"),
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            messages: require(`../../lang/${locale}.json`),
        },
    };
};
