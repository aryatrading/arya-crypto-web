import {
    FC,
    createContext,
    useContext,
} from "react";
import { useMediaQuery } from "react-responsive";
import { screens } from "tailwindcss/defaultTheme";

export const ResponsiveContext = createContext({
    isTabletOrMobileScreen: false,
});

const ResponsiveProvider: FC<{ children: any }> = ({ children }) => {
    const isTabletOrMobileScreen = useMediaQuery({ query: `(max-width: ${screens.md})` })

    const contextValue = { isTabletOrMobileScreen };

    return (
        <ResponsiveContext.Provider value={contextValue}>
            {children}
        </ResponsiveContext.Provider>
    );
};

export const useResponsive = () => useContext(ResponsiveContext);

export default ResponsiveProvider;
