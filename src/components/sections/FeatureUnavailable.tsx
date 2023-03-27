import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Heading2 } from "../text/Headings";
import React from "react";
import { useTranslations } from "use-intl";
import Card from "../containers/Card";

function FeatureUnavailable(): JSX.Element {
    const t = useTranslations("feature-unavailable");

    return (
        <div className="w-full">
            <Card className="w-1/2 my-4 md:my-20 lg:my-48 mx-auto">
                <div className="md:flex p-4">
                    <div className="px-12 flex justify-center items-center bg-orange-soft rounded-xl text-center">
                        <span className="text-3xl text-orange">
                            <FontAwesomeIcon icon={faCircleExclamation} />
                        </span>
                    </div>
                    <div className="w-full p-10">
                        <Heading2>{t("title")}</Heading2>
                        <span className="text-txt-body">
                            {t("description")}
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default FeatureUnavailable;
