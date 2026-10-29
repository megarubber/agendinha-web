import type Appointment from "~~/shared/types/appointment";
import { useAuthStore } from "~/stores/auth";

export function useGoogleCalendar() {
    const config = useRuntimeConfig();
    const token = useCookie("token");
    const { googleTokens } = storeToRefs(useAuthStore());

    async function createTaskIntoCalendar(appointment: Appointment) {
        return await $fetch(`${config.public.apiBase}/agendamentos/google`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
            body: {
                appointment,
                tokens: googleTokens.value,
            },
        });
    }

    return {
        createTaskIntoCalendar,
    };
}