import axios from "axios";

type Options = {
  isAuth?: boolean,
  query?: any,
  headers?: any
}

export function generateHeaders(opts: Options) {

}

export async function fetcher(url: string, opts: Options = {}) {
  console.log('fetching..')
  // append query to url
  if (opts.query) {
    url += '?'
    for (const key in opts.query) {
      let value = opts.query[key]
      if (Array.isArray(value)) {
        if (value.length === 0) continue
        for (let i = 0; i < value.length; i++) {
          url += `${key}=${value[i]}&`
        }
      }
    }
  }
  const data = await axios.get(url, {
    headers: {
      ...opts.headers
    }
  })
    .then(res => res.data.data)
    .catch(err => err.response.data)
  return data
}