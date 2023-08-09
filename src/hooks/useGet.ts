import { useCallback, useEffect, useState } from 'react'
import { getData } from '@/services'

export const useGet = (url: string) => {
  const [data, setData] = useState<unknown>(null)
  const requestData = useCallback(
    () => getData(url).then((res) => setData(res)),
    [url]
  )

  useEffect(() => {
    requestData()
  }, [url, requestData])

  return { ...data, requestData }
}
