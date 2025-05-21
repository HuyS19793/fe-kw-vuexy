import chalk from 'chalk'

interface ApiResponse<T = any> {
  code: number
  message: string
  data: T | null
}

// Function to truncate the string if it exceeds the allowed length
function truncateErrorMessage(str: string, maxLength = 200) {
  if (str.length <= maxLength) {
    return str
  }

  return str.slice(0, maxLength) + '... [truncated]'
}

const mutateServer = async (
  path: string,
  data: any,
  options: Record<string, any> = {
    method: 'POST'
  }
): Promise<ApiResponse> => {
  // const accessToken = getAccessToken()

  const baseUrl = process.env.API_URL

  if (!baseUrl) {
    console.error(chalk.red('[mutateServer] Missing "API_URL" in environment variables'))

    return {
      code: 500,
      message: 'Missing API URL configuration',
      data: null
    }
  }

  if (!path || typeof path !== 'string') {
    console.error(chalk.red('[mutateServer] Invalid or missing "path" parameter'))

    return {
      code: 400,
      message: 'Invalid or missing path parameter',
      data: null
    }
  }

  // if (!accessToken) {
  //   console.error(chalk.red('[mutateServer] Missing access token'))

  //   return {
  //     code: 401,
  //     message: 'Missing access token',
  //     data: null
  //   }
  // }

  const endpoint = `${baseUrl}${path}`

  try {
    const res = await fetch(endpoint, {
      // method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})

        // Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
      ...options
    })

    // console.log(res)

    if (!res.ok) {
      const { status } = res
      let errorMessage = ''

      switch (status) {
        case 401:
          errorMessage = 'Unauthorized access'
          console.error(chalk.yellow(`[mutateServer] Unauthorized (401) at ${path}`))
          break

        case 403:
          errorMessage = 'Forbidden access'
          console.error(chalk.magenta(`[mutateServer] Forbidden (403) at ${path}`))
          break

        case 404:
          errorMessage = 'Resource not found'
          console.error(chalk.blue(`[mutateServer] Not Found (404) at ${path}`))
          break

        case 500:
          errorMessage = 'Internal server error'
          console.error(chalk.red(`[mutateServer] Server Error (500) at ${path}`))
          break

        default: {
          const errorText = await res.text()

          errorMessage = truncateErrorMessage(errorText)
          console.error(
            chalk.red(`[mutateServer] Request to ${path} failed with status ${status}: `) + chalk.gray(errorMessage)
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
      if (res.body === null) {
        return {
          code: res.status,
          message: 'Success',
          data: null
        }
      }

      const responseData = await res.json()

      return {
        code: res.status,
        message: 'Success',
        data: responseData
      }
    } catch (jsonErr) {
      const errMessage = truncateErrorMessage(String(jsonErr))

      console.error(chalk.red(`[mutateServer] Error parsing JSON response at ${path}:`), chalk.gray(errMessage))

      return {
        code: 500,
        message: 'Error parsing JSON response',
        data: null
      }
    }
  } catch (error) {
    // Network error or other unexpected errors
    const errMessage = truncateErrorMessage(String(error))

    console.error(chalk.red(`[mutateServer Network Error] at ${path}:`), chalk.gray(errMessage))

    return {
      code: 500,
      message: 'Network error occurred',
      data: null
    }
  }
}

export default mutateServer
