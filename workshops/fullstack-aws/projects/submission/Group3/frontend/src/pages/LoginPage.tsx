import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../auth/useAuth'
import type { User } from '../auth/context'
import { post } from '../api/client'
import { PageWrapper, PageTitle, PageSubtitle } from '../components/PageHero.styled'
import { FormGroup, Label, Input, SubmitButton, ErrorMessage } from '../components/Form.styled'

import {
  SlideViewport,
  SlideTrack,
  SlidePanel,
  AuthForm,
  ToggleGroup,
  ToggleThumb,
  ToggleButton,
  DevLoginSection,
  DevLoginLabel,
  DevLoginButtons,
  DevLoginButton,
} from './LoginPage.styled'

type Mode = 'login' | 'signup'

function LoginPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [error, setError] = useState('')
  const [signupError, setSignupError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const { isLoggedIn, login, loginAsMock } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true })
    }
  }, [isLoggedIn, navigate])

  function handleModeChange(nextMode: Mode) {
    setMode(nextMode)
  }

  // Temporary dev shortcuts: the backend doesn't distinguish roles on
  // /login yet, so these sign in directly with mock users of each role.
  // Remove once real role-aware login is wired up.
  function handleDevLogin(role: User['role']) {
    const mockUser: User =
      role === 'TrainingManager'
        ? { user_id: 999, username: 'admin.manager', email: 'manager@noticeboardtracker.dev', role }
        : { user_id: 998, username: 'dev.trainee', email: 'trainee@noticeboardtracker.dev', role }
    loginAsMock(mockUser)
    navigate('/')
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  setError('')

  const formData = new FormData(event.currentTarget)
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  setIsLoggingIn(true)
  try
  {
    await login(email, password)
    navigate('/')
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Something went wrong.')
  } finally {
    setIsLoggingIn(false)
  }
}

async function handleSignup(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  setSignupError('')

  const formData = new FormData(event.currentTarget)
  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    setSignupError('Passwords do not match.')
    return
  }

  setIsSigningUp(true)
  try {
    // No role/requesting_user_id: this is the public self-signup path,
    // which the backend always creates as a Trainee.
    await post('/users', { username, email, password })
    await login(email, password)
    navigate('/')
  } catch (err) {
    setSignupError(err instanceof Error ? err.message : 'Something went wrong.')
  } finally {
    setIsSigningUp(false)
  }
}

  return (
    <Layout>
      <PageWrapper>
        <PageTitle>{mode === 'login' ? 'Welcome back' : 'Create your account'}</PageTitle>
        <PageSubtitle>
          {mode === 'login'
            ? 'Log in to check your training progress, assignments, and notices.'
            : 'Sign up in minutes to get started with NoticeBoardTracker.'}
        </PageSubtitle>

        <ToggleGroup role="group" aria-label="Choose log in or sign up">
          <ToggleThumb aria-hidden="true" $mode={mode} />
          <ToggleButton type="button" $active={mode === 'login'} aria-pressed={mode === 'login'} onClick={() => handleModeChange('login')}>
            Log In
          </ToggleButton>
          <ToggleButton type="button" $active={mode === 'signup'} aria-pressed={mode === 'signup'} onClick={() => handleModeChange('signup')}>
            Sign Up
          </ToggleButton>
        </ToggleGroup>

        <SlideViewport>
          <SlideTrack $mode={mode}>
            <SlidePanel>
              <AuthForm onSubmit={handleLogin} aria-hidden={mode !== 'login'} inert={mode !== 'login'}>
                <FormGroup>
                  <Label htmlFor="login-email">Email address</Label>
                  <Input id="login-email" name="email" type="email" autoComplete="email" required />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" name="password" type="password" autoComplete="current-password" required />
                </FormGroup>
                {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
                <SubmitButton type="submit" disabled={isLoggingIn}>
                  {isLoggingIn ? 'Logging in…' : 'Log In'}
                </SubmitButton>
              </AuthForm>
            </SlidePanel>
            <SlidePanel>
              <AuthForm onSubmit={handleSignup} aria-hidden={mode !== 'signup'} inert={mode !== 'signup'}>
                <FormGroup>
                  <Label htmlFor="signup-username">Username</Label>
                  <Input id="signup-username" name="username" type="text" autoComplete="username" required />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="signup-email">Email address</Label>
                  <Input id="signup-email" name="email" type="email" autoComplete="email" required />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" name="password" type="password" autoComplete="new-password" required />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="signup-confirmPassword">Confirm password</Label>
                  <Input id="signup-confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required />
                </FormGroup>
                {signupError && <ErrorMessage role="alert">{signupError}</ErrorMessage>}
                <SubmitButton type="submit" disabled={isSigningUp}>
                  {isSigningUp ? 'Signing up…' : 'Sign Up'}
                </SubmitButton>
              </AuthForm>
            </SlidePanel>
          </SlideTrack>
        </SlideViewport>

        <DevLoginSection>
          <DevLoginLabel>Development shortcuts (temporary, until real login is role-aware)</DevLoginLabel>
          <DevLoginButtons>
            <DevLoginButton type="button" onClick={() => handleDevLogin('Trainee')}>
              Continue as Trainee
            </DevLoginButton>
            <DevLoginButton type="button" onClick={() => handleDevLogin('TrainingManager')}>
              Continue as Training Manager
            </DevLoginButton>
          </DevLoginButtons>
        </DevLoginSection>
      </PageWrapper>
    </Layout>
  )
}

export default LoginPage