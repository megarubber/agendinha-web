import type UserProfilePhotoUpdate from "@/interfaces/userProfilePhotoUpdate";

export default async function updateProfileImage(photoInfo: UserProfilePhotoUpdate) {
  const { $api } = useNuxtApp();
  const token = useCookie("token");
  
  const formData = new FormData();
  formData.append("id", `${photoInfo.id}`);
  formData.append("foto_perfil", photoInfo.foto_perfil);

  const response = await $api("/usuarios/foto", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    body: formData
  });
  return response;
}