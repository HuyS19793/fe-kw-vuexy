import chalk from 'chalk'

interface ApiResponse<T = any> {
  code: number
  message: string
  data: T | null
}

type fetchServerType = (url: string, options?: fetchServerOptions) => Promise<ApiResponse>

interface fetchServerOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>
  next?: {
    tags: string[]
  }
}

interface fetchServerResponse extends Response {
  json: () => Promise<any>
}

// Function to truncate the string if it exceeds the allowed length
function truncateErrorMessage(str: string, maxLength = 200) {
  if (str.length <= maxLength) {
    return str
  }

  return str.slice(0, maxLength) + '... [truncated]'
}

const fetchServer: fetchServerType = async (path = '', options: fetchServerOptions = {}) => {
  // console.log(path)

  // Check input path
  if (!path || typeof path !== 'string') {
    console.error(chalk.red('[fetchServer] Invalid or missing "path" parameter'))

    return {
      code: 400,
      message: 'Invalid or missing path parameter',
      data: null
    }
  }

  // Check environment variables
  const baseUrl = process.env.API_URL

  if (!baseUrl) {
    console.error(chalk.red('[fetchServer] Missing "API_URL" in environment variables'))

    return {
      code: 500,
      message: 'Missing API URL configuration',
      data: null
    }
  }

  // const accessToken = getAccessToken()

  // if (!accessToken) {
  //   console.error(chalk.red('[fetchServer] Missing access token'))

  //   return {
  //     code: 401,
  //     message: 'Missing access token',
  //     data: null
  //   }
  // }

  try {
    const endpoint = `${baseUrl}${path}`

    const response: fetchServerResponse = await fetch(endpoint, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})

        // Authorization: `Bearer ${accessToken}`,
      },
      ...options
    })

    // Case when status code is not 2xx (response.ok = false)
    if (!response.ok) {
      const { status } = response
      let errorMessage = ''

      switch (status) {
        case 401:
          errorMessage = 'Unauthorized access'
          console.error(chalk.yellow(`[fetchServer] Unauthorized (401) at ${path}`))
          break

        case 403:
          errorMessage = 'Forbidden access'
          console.error(chalk.magenta(`[fetchServer] Forbidden (403) at ${path}`))
          break

        case 404:
          errorMessage = 'Resource not found'
          console.error(chalk.blue(`[fetchServer] Not Found (404) at ${path}`))
          break

        case 500:
          errorMessage = 'Internal server error'
          console.error(chalk.red(`[fetchServer] Server Error (500) at ${path}`))
          break

        default: {
          const errorText = await response.text()

          errorMessage = truncateErrorMessage(errorText)
          console.error(
            chalk.red(`[fetchServer] Request to ${path} failed with status ${status}: `) + chalk.gray(errorMessage)
          )
          break
        }
      }

      return {
        code: status,
        message: errorMessage,
        data: null
      }
    }

    // If success (2xx), parse JSON
    try {
      const data = await response.json()

      return {
        code: response.status,
        message: 'Success',
        data
      }
    } catch (jsonErr) {
      const errMessage = truncateErrorMessage(String(jsonErr))

      console.error(chalk.red(`[fetchServer] Error parsing JSON response at ${path}:`), chalk.gray(errMessage))

      return {
        code: 500,
        message: 'Error parsing JSON response',
        data: null
      }
    }
  } catch (error) {
    // Network error (connection, DNS, ...) or other unusual error
    const errMessage = truncateErrorMessage(String(error))

    console.error(chalk.red(`[fetchServer Network Error] at ${path}:`), chalk.gray(errMessage))

    return {
      code: 500,
      message: 'Network error occurred',
      data: null
    }
  }
}

export default fetchServer
