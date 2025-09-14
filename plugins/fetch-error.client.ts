export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$fetch = nuxtApp.$fetch.create({
    onResponseError({ response }: FetchContext & { response: FetchResponse<any> }) {
      const { error } = useNotifier()
      const msg = response?._data?.message || `Request error (${response?.status})`
      error(msg, {}, `fetch:${response?.url}:${response?.status}`)
    }
  })
})
