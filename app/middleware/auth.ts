import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();
  const token = useCookie("token");

  if (token.value) {
    const { authenticated } = storeToRefs(auth);
    authenticated.value = true;

    await auth.refreshAuth();
  }

  if (!token.value) {
    const firstTime = useCookie("firsttime");
    const target = firstTime.value === "false" ? "/login" : "/boas-vindas";

    if (to.path !== target) return navigateTo(target);
    return;
  }

  const requiredRole = to.meta.requiresRole as string | string[] | undefined;

  if (requiredRole) {
    const { user } = storeToRefs(auth);

    if (!user.value) {
      if (to.path !== "/login") return navigateTo("/login");
      return;
    }

    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (!allowedRoles.includes(user.value.role)) {
      if (to.path !== "/") return navigateTo(user.value.role == "ROLE_ADMIN" ? "/admin" : "/");
      return;
    }
  }
});