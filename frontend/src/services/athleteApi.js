import { http } from "./http";
import { readSession } from "../features/auth/utils/sessionStore";

export async function getAthleteProfile() {
    const session = readSession();
    const token = session?.token;
    return http(`/athlete/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}
