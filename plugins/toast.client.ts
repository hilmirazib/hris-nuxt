import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default defineNuxtPlugin(() => {
  // Optional: set default global options via wrapper (lihat composable di bawah)
  return {
    provide: {
      // expose jika ingin akses via `const {$toast} = useNuxtApp()`
      toast
    }
  }
})
