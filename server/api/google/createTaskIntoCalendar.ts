import type Exam from "~/interfaces/exam";
import { useAuthStore } from "~/app/store/auth";

export default async function createTaskIntoCalendar(exam: Exam) {
    const { $api } = useNuxtApp();
    const token = useCookie("token");
    const { googleTokens } = storeToRefs(useAuthStore());

    const response = await $api(`/agendamentos/google`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}`, },
        body: { exam, tokens: googleTokens.value }
    });
    return response;
}