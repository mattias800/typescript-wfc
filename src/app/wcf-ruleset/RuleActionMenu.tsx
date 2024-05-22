import * as React from "react";
import {ActionMenu, ActionMenuItem} from "@stenajs-webui/elements";

export interface RuleActionMenuProps {

}

export const RuleActionMenu: React.FC<RuleActionMenuProps> = () => {
    return (
        <ActionMenu>
            <ActionMenuItem label={"Remove"}/>
        </ActionMenu>
    )
}
