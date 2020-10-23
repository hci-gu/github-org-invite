import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const getUser = async (accessToken) => {
  const response = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  })

  return response.data
}

const invite = async (user) => {
  const response = await axios.post(`${API_URL}/invite`, {
    userId: user.id,
  })
  console.log(response)
  return response.data.success
}

const getClient = async () => {
  const response = await axios.get(`${API_URL}/oauth`)

  return response.data
}

const openOauth = async ({ clientId, id }) => {
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

function App() {
  const [client, setClient] = useState(null)
  const [progress, setProgress] = useState(null)

  useEffect(() => {
    getClient().then((client) => setClient(client))
  }, [])

  const onGithubLogin = async () => {
    try {
      setProgress('pending')
      const accessToken = await openOauth(client)
      console.log('accessToken', accessToken)
      const user = await getUser(accessToken)
      console.log('user', user)
      const success = await invite(user)
      if (success) {
        setProgress('sucess')
      }
    } catch (e) {
      setProgress('error')
    }
  }

  return (
    <div>
      {client && !progress && (
        <button onClick={onGithubLogin}>Login with github</button>
      )}
      {progress}
    </div>
  )
}

export default App
