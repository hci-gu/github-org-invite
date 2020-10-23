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

export const invite = async (user) => {
  const response = await axios.post(`${API_URL}/invite`, {
    userId: user.id,
  })
  console.log(response)
  return response.data.success
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
      if (message.data) {
        const response = JSON.parse(message.data)
        success = response.success
        resolve(response.accessToken)
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
