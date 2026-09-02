import type Exam from "#shared/types/exam";
import { useAuthStore } from "~/stores/auth";

export function useGoogleCalendar() {
    const config = useRuntimeConfig();
    const token = useCookie("token");
    const { googleTokens } = storeToRefs(useAuthStore());

    async function createTaskIntoCalendar(exam: Exam) {
        return await $fetch(`${config.public.apiBase}/agendamentos/google`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
            body: {
                exam,
                tokens: googleTokens.value,
            },
        });
    }

    return {
        createTaskIntoCalendar,
    };
}