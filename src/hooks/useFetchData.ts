import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const useFetchData = ({ url = '', params = {}, enabled = true }: { url: string; params?: any; enabled?: boolean }) =>
  useQuery({
    queryKey: [url, params],
    queryFn: async () => {
      const response = await axios.get(url, { params })

      return response.data
    },
    enabled
  })

export default useFetchData
