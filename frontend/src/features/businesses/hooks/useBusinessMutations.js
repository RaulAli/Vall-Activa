import { useApp } from "../../../context/Provider";
import { readSession } from "../../auth/hooks/useSession";

export function useBusinessMutations() {
    const { mutations } = useApp();
    const token = readSession()?.token;

    return {
        createBusiness: (payload) => mutations.businesses.create(payload, token),
        updateBusiness: (id, payload) => mutations.businesses.update(id, payload, token),
        deleteBusiness: (id) => mutations.businesses.remove(id, token),
    };
}
