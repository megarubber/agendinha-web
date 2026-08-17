import isNumber from "~/server/utils/others/isNumber";

export default async function confirmAccount(data: string | number) {
  const { $api } = useNuxtApp();
  
  let body: any = {};

  if(isNumber(data))
    body = { id_usuario: data };
  else
    body = { email: data };

  const response = await $api("/usuarios/confirmar", {
    method: "POST",
    body
  });

  return response;
}