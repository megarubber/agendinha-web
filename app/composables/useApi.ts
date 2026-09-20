export const useApi = createUseFetch(() => {
  const config = useRuntimeConfig();
  
  return {
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      const token = useCookie('token').value;
      if (token) {
        options.headers = new Headers(options.headers);

        options.headers.set(
          'Authorization',
          `Bearer ${token}`
        )
      }
    },
  };
});