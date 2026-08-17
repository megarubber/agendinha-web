export const useLoaderStore = defineStore('loader', {
  state: () => ({
    isLoading: false,
  }),
  actions: {
    setLoading(status: boolean) {
      this.isLoading = status;
    },
    startLoading() {
      this.isLoading = true;
    },
    endLoading() {
      this.isLoading = false;
    },
  },
});