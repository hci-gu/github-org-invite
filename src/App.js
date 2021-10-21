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

const UsernameInput = styled.input`
  font-size: 18px;
  padding: 10px;
  margin: 10px;
  background: #fafafa;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
`

function App() {
  const [client, setClient] = useState(null)
  const [{ progress, repository }, setProgress] = useState({})
  const [username, setUsername] = useState('')

  useEffect(() => {
    getClient().then((client) => setClient(client))
  }, [])

  const onGithubLogin = async () => {
    try {
      setProgress({ progress: 'pending' })
      const accessToken = await openOauth(client)
      const user = await getUser(accessToken)
      const inviteResponse = await invite(user, username)
      setProgress({
        progress: inviteResponse.message,
        repository: inviteResponse.repository,
      })
    } catch (e) {
      console.log(e)
      setProgress({ progress: 'error' })
    }
  }

  return (
    <Container>
      <Text>
        <h1>
          Hej och välkommen till TIG169 - programmering för mobila enheter.
        </h1>
        {!progress && (
          <span>
            Skriv in ditt x-konto och klicka på knappen nedan för att logga in
            med ditt Github-konto så blir du inbjuden till organisationen där
            kursens uppgifter kommer utföras.
            <br></br>
            <br></br>
            För att vi ska veta vilken inlämnad uppgift som är din behöver du
            skriva in rätt x-konto.
          </span>
        )}
        {progress === 'pending' && <span>Väntar på svar från Github...</span>}
        {progress === 'success' && (
          <span>
            Du ska nu ha fått en inbjudan till mailen du registrerade ditt
            Github-konto med. Det Github repo där du ska lämna in uppgifter
            finns nu{' '}
            <a href={repository} target="_blank">
              här
            </a>{' '}
            det finns instruktioner i Canvas för hur du laddar hem koden samt
            gör inlämningen.
          </span>
        )}
        {progress === 'error' && (
          <span>
            Något gick fel, vänligen ladda om sidan och försök igen. Om det
            fortfarande inte funkar så kan du kontakta oss direkt på Canvas för
            att få inbjudan skickad manuellt.
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
        <UsernameInput
          placeholder="T.ex. gusandse"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      )}
      {client && !progress && (
        <GithubLoginButton
          onClick={onGithubLogin}
          style={{ width: 200, opacity: username.length ? 1 : 0.5 }}
        >
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
