import React, { useState } from "react";

const AdminUser = {
    full_name: 'HRMS Lite Admin',
    photo: null
};

export const UserContext = React.createContext(AdminUser);

const UserProvider = ({ children }) => {
    const [user] = useState(AdminUser);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;
