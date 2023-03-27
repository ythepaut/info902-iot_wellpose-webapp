import NavbarItem from "./NavbarItem";
import {
    faChartLine,
    faGear,
    faHouseMedical,
    faPersonCane,
    faSignOutAlt,
    faTableColumns,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Heading3 } from "../../text/Headings";
import Link from "next/link";
import { useTranslations } from "use-intl";

function Navbar(): JSX.Element {
    const t = useTranslations();

    return (
        <nav className="w-14 lg:w-2/12 max-w-xs min-h-screen bg-white border-r-2 border-border relative">
            <Link href="/" passHref>
                <div className="inline-flex space-x-3 px-1 lg:px-4 py-8 w-full cursor-pointer">
                    <div className="w-9 h-9 mx-auto lg:mx-0 rounded-2lg bg-gradient-to-bl from-blue-gradient-from to-blue-gradient-to text-center text-md text-white py-1">
                        <FontAwesomeIcon icon={faHouseMedical} />
                    </div>
                    <Heading3 className="hidden 3xl:flex text-blue my-auto tracking-normal">
                        {t("general.app.name")}
                    </Heading3>
                    <Heading3 className="hidden lg:flex 3xl:hidden text-blue my-auto tracking-normal">
                        {t("general.app.abbr")}
                    </Heading3>
                </div>
            </Link>

            <NavbarItem
                name={t("navbar.dashboard")}
                icon={faTableColumns}
                activeRoutes={[/^(\/)$/]}
                href="/"
            />
            <NavbarItem
                name={t("navbar.patients")}
                icon={faPersonCane}
                activeRoutes={[/^\/patients$/]}
                href="/patients"
            />
            <NavbarItem
                name={t("navbar.reports")}
                icon={faChartLine}
                activeRoutes={[/^\/reports.*$/]}
                href="/reports"
            />

            <div className="w-full py-6">
                <hr className="mx-auto w-2/3 text-grey-200" />
            </div>
            <NavbarItem
                name={t("navbar.settings")}
                activeRoutes={[/^\/settings$/]}
                icon={faGear}
                href="/settings"
            />

            <NavbarItem
                name={t("navbar.logout")}
                active={false}
                activeRoutes={[]}
                icon={faSignOutAlt}
                className="absolute inset-x-0 bottom-2"
            />
        </nav>
    );
}

export default Navbar;
