export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = async (url: string, options: any = {}) => {
    try {
      const response = await $fetch.raw(url, {
        baseURL: config.public.apiBase,
        ignoreResponseError: true,
        ...options,
      });

      return {
        status: response.status,
        data: response._data,
        headers: response.headers,
        response,
      };
    } catch (error: any) {
      return {
        status: error?.response?.status ?? null,
        data: error?.response?._data ?? null,
        error,
      };
    }
  };

  return {
    provide: {
      api,
    },
  };
});