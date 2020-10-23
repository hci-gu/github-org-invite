import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { GithubLoginButton } from 'react-social-login-buttons'
import { PacmanLoader } from 'react-spinners'
import { ReactSVG } from 'react-svg'

import { getUser, invite, getClient, openOauth } from './api'

const Container = styled.div`
  margin: 0 auto;
  width: 60%;
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  @media (max-width: 640px) {
    width: 100%;
  }
`

const Text = styled.div`
  padding: 1em;
  max-width: 600px;
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  > h1,
  span {
    text-align: center;
    text-align: center;
  }
`

const Progress = styled.div`
  margin-top: 25px;
  margin-left: -200px;
`

const Result = styled.div`
  margin-top: 25px;
  svg {
    height: 200px;
  }
`

function App() {
  const [client, setClient] = useState(null)
  const [progress, setProgress] = useState()

  useEffect(() => {
    getClient().then((client) => setClient(client))
  }, [])

  const onGithubLogin = async () => {
    try {
      setProgress('pending')
      const accessToken = await openOauth(client)
      const user = await getUser(accessToken)
      const status = await invite(user)
      setProgress(status)
    } catch (e) {
      console.log(e)
      setProgress('error')
    }
  }
  console.log(progress)

  return (
    <Container>
      <Text>
        <h1>
          Hej och välkommen till TIG169 - programmering för mobile enheter.
        </h1>
        {!progress && (
          <span>
            Klicka på knappen nedan för att logga in med ditt Github konto så
            blir du inbjuden till organisationen där kursens uppgifter kommer
            utföras.
          </span>
        )}
        {progress === 'pending' && <span>Väntar på svar från Github...</span>}
        {progress === 'success' && (
          <span>
            Du ska nu ha fått en inbjudan till mailen du registrerade ditt
            Github konto med.
          </span>
        )}
        {progress === 'error' && (
          <span>
            Något gick fel, vänligen refresha sidan och försök igen. Om det
            fortfarande inte funkar så kan du kontakta oss direkt för att få
            inbjudan skickad manuellt.
          </span>
        )}
        {progress === 'already-member' && (
          <span>
            Du verkar redan vara inbjuden till organisationen. Om du ändå inte
            är det så kan du kontakta oss via Canvas för att få inbjudan skickad
            manuellt.
          </span>
        )}
      </Text>
      {client && !progress && (
        <GithubLoginButton onClick={onGithubLogin} style={{ width: 200 }}>
          Login with github
        </GithubLoginButton>
      )}
      {progress === 'pending' && (
        <Progress>
          <PacmanLoader size={100} color="#273A99" />
        </Progress>
      )}
      {['success', 'error', 'already-member'].includes(progress) && (
        <Result>
          <ReactSVG src={`/svg/${progress}.svg`} />
        </Result>
      )}
    </Container>
  )
}

export default App
