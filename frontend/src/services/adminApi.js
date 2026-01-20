import { http } from "./http";

export async function approveBusiness(userId, token) {
    return http(`/admin/businesses/${userId}/approve`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
}

export async function rejectBusiness(userId, token) {
    return http(`/admin/businesses/${userId}/reject`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
}
