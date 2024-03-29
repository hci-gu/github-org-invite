import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL

export const getUser = async (accessToken) => {
  const response = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  })

  return response.data
}

export const invite = async (user, canvasUsername) => {
  const response = await axios.post(`${API_URL}/invite`, {
    userId: user.id,
    canvasUsername,
  })
  return response.data
}

export const getClient = async () => {
  const response = await axios.get(`${API_URL}/oauth`)

  return response.data
}

export const openOauth = async ({ clientId, id }) => {
  return new Promise((resolve, reject) => {
    const popup = window.open(
      `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${API_URL}/oauth/callback&state=${id}`,
      id,
      'width=600,height=1000,menubar=no,location=no,resizable=no,scrollbars=no,status=no'
    )
    let success
    window.addEventListener('message', (message) => {
      let data
      if (message.data && typeof message.data === 'string') {
        data = JSON.parse(message.data)
      }
      if (data && data.success !== undefined) {
        success = data.success
        resolve(data.accessToken)
      }
    })

    let interval = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(interval)
          if (!success) reject('window closed')
          return
        }
      } catch (e) {
        console.log(e)
      }
    }, 500)
  })
}
