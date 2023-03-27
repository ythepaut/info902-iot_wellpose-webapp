import { GetStaticProps } from "next";
import Header from "../../components/layout/Header";
import Navbar from "../../components/navigation/navbar/Navbar";
import { useTranslations } from "use-intl";

export default function PatientInfo(): JSX.Element {
    const t = useTranslations("patient-info");

    return (
        <div className="flex bg-bg-light">
            <Navbar />
            <div className="w-10/12 fixed top-0 right-0 overflow-y-auto max-h-screen">
                <Header title={t("title")}></Header>
                <span>Work in progress !</span>
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
