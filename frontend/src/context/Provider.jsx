import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { readSession, clearSession } from "../features/auth/utils/sessionStore";

import * as routesApi from "../services/routesApi";
import * as businessesApi from "../services/businessesApi";
import * as offersApi from "../services/offersApi";
import * as authApi from "../services/authApi";
import * as adminApi from "../services/adminApi";

import { buildRoutesQueries } from "./queries/routesQueries";
import { buildRoutesMutations } from "./commands/routesMutations";

import { buildBusinessesQueries } from "./queries/businessesQueries";
import { buildBusinessesMutations } from "./commands/businessesMutations";

import { buildOffersQueries } from "./queries/offersQueries";
import { buildOffersMutations } from "./commands/offersMutations";

import { buildAuthQueries } from "./queries/authQueries";
import { buildAuthMutations } from "./commands/authMutations";
import { buildAdminMutations } from "./commands/adminMutations";

const AppContext = createContext(null);

export function Provider({ children }) {
    const [session, setSession] = useState(() => readSession());
    const [me, setMe] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refreshDashboard = () => setRefreshTrigger(t => t + 1);

    // Stable queries and mutations
    const baseValue = useMemo(() => {
        return {
            queries: {
                routes: buildRoutesQueries(routesApi),
                businesses: buildBusinessesQueries(businessesApi),
                offers: buildOffersQueries(offersApi),
                auth: buildAuthQueries(authApi),
            },
            mutations: {
                routes: buildRoutesMutations(routesApi),
                businesses: buildBusinessesMutations(businessesApi),
                offers: buildOffersMutations(offersApi),
                auth: buildAuthMutations(authApi),
                admin: buildAdminMutations(adminApi),
            }
        };
    }, []);

    // Full context value
    const value = useMemo(() => ({
        ...baseValue,
        session,
        setSession,
        me,
        refreshTrigger,
        refreshDashboard
    }), [baseValue, session, me, refreshTrigger]);

    useEffect(() => {
        let mounted = true;
        async function loadMe() {
            if (!session?.token) {
                setMe(null);
                return;
            }
            try {
                // Use the stable query reference
                const data = await baseValue.queries.auth.me(session.token);
                if (mounted) setMe(data);
            } catch {
                if (mounted) {
                    clearSession();
                    setSession(null);
                    setMe(null);
                }
            }
        }
        loadMe();
        return () => {
            mounted = false;
        };
    }, [session?.token, baseValue.queries.auth]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used within Provider");
    return ctx;
}
