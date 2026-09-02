export const useApi = createUseFetch(() => {
  const config = useRuntimeConfig();
  
  return {
    baseURL: config.public.apiBase,
  };
});