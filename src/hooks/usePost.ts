import { useCallback } from 'react'
import { postData } from '@/services'

export const usePost = (url: string) => {
  const sendData = useCallback(
    async (data: Record<string, unknown>) => {
      return await postData(url, data)
    },
    [url]
  )

  return { sendData }
}
