export async function getData(url: string) {
  const postData = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}${url}`, postData)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export async function postData(url: string, data: Record<string, unknown>) {
  const postData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}${url}`, postData)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
