import { useContext } from "react";
import Admin from "../navigation/Admin";
import { UserContext } from "../providers/UserProvider";
import { useView, ViewContext } from "../utils/View";

function SidebarMain() {
    const user = useContext(UserContext);
    const view = useView();

    return (
        <ViewContext.Provider value={view}>
            <Admin user={user}></Admin>
        </ViewContext.Provider>
    );
}

export default SidebarMain;