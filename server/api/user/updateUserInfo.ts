import type UserUpdate from "~/interfaces/userUpdate";

export default async function updateUserInfo(userInfo: UserUpdate) {
  const { $api } = useNuxtApp();
  const token = useCookie("token");

  const response = await $api("/usuarios/update", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    body: userInfo
  });
  return response;
}
