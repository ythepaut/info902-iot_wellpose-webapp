import { GetStaticProps } from "next";
import Header from "../../components/layout/Header";
import Navbar from "../../components/navigation/navbar/Navbar";
import { useTranslations } from "use-intl";
import Breadcrumb from "../../components/navigation/breadcrumb/Breadcrumb";

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
