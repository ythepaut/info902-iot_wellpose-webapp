import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface BreadcrumbItemProps {
    title?: string;
    icon?: IconProp;
    action?: () => void;
}

function BreadcrumbItem(props: BreadcrumbItemProps): JSX.Element {
    return (
        <span
            className={`${
                props.action
                    ? "text-blue-light cursor-pointer"
                    : "cursor-default text-grey-800"
            } px-2 font-semibold`}
            onClick={props.action}
        >
            {props.icon && <FontAwesomeIcon icon={props.icon} />}
            {props.title && props.title}
        </span>
    );
}

export default BreadcrumbItem;
