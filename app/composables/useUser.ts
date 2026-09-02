import type UserUpdate from "~~/shared/types/userUpdate";
import type UserProfilePhotoUpdate from "~~/shared/types/userProfilePhotoUpdate";
import type UserNewPasswordWithLogin from "~~/shared/types/userNewPasswordWithLogin";

export const useUser = () => {
    const config = useRuntimeConfig();
    const token = useCookie("token");

    async function deleteAccount(id_usuario: number) {
        const response = await $fetch(`${config.public.apiBase}/usuarios/delete`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token.value}`, },
            body: { id_usuario }
        });
        return response;
    }

    async function getUserInfo() {    
      const response = await $fetch(`${config.public.apiBase}/usuarios`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
    
      return response;
    }

    async function updateUserInfo(userInfo: UserUpdate) {
        const response = await $fetch(`${config.public.apiBase}/usuarios/update`, {
            method: "PUT",
            headers: {
            Authorization: `Bearer ${token.value}`,
            },
            body: userInfo
        });
        return response;
    }

    async function updateProfileImage(photoInfo: UserProfilePhotoUpdate) {
        const formData = new FormData();
        formData.append("id", `${photoInfo.id}`);
        formData.append("foto_perfil", photoInfo.foto_perfil);

        const response = await $fetch(`${config.public.apiBase}/usuarios/foto`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token.value}`, },
            body: formData
        });
        return response;
    }

    async function setNewPasswordWithLogin(password: UserNewPasswordWithLogin) {
        const response = await $fetch(`${config.public.apiBase}/usuarios/redefinir-senha`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token.value}`, },
            body: password,
        });
        return response;
    }

    return {
        deleteAccount,
        getUserInfo,
        updateUserInfo,
        updateProfileImage,
        setNewPasswordWithLogin
    };
};