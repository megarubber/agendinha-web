export default async function getUserInfo(id_usuario: number) {
  return await fetch(`${config.apiBase}/usuarios/${id_usuario}`, {
    method: "GET",
  });
}