import { useApp } from "../../../context/Provider";
import { readSession } from "../../auth/hooks/useSession";

export function useOfferMutations() {
    const { mutations } = useApp();
    const token = readSession()?.token;

    return {
        createOffer: (payload) => mutations.offers.create(payload, token),
        updateOffer: (id, payload) => mutations.offers.update(id, payload, token),
        deleteOffer: (id) => mutations.offers.remove(id, token),
    };
}
