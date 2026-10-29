import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();
  const token = useCookie("token");
  const { user, authenticated } = storeToRefs(auth);

  if (token.value) {
    await auth.refreshAuth();
    return;
  }

  if (!token.value) {
    const firstTime = useCookie("firsttime");
    const target = firstTime.value === "false" ? "/login" : "/boas-vindas";

    if (to.path !== target) return navigateTo(target);
    return;
  }

  const requiredRole = to.meta.requiresRole as string | string[] | undefined;

  if (requiredRole) {
    if (!user.value.id_usuario) {
      const firstTime = useCookie("firsttime");
      const target = firstTime.value === "false" ? "/login" : "/boas-vindas";

      if (to.path !== target) return navigateTo(target);
      return;
    }

    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (!allowedRoles.includes(user.value.role)) {
      if (to.path !== "/") return navigateTo(user.value.role == "ROLE_ADMIN" ? "/admin" : "/");
      return;
    }
  }
});