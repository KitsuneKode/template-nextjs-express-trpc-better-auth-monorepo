'use client'
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'
import { authClient } from '@template/auth/client'
import React, { useReducer, useState } from 'react'
import { Input } from '@template/ui/components/input'
import { Label } from '@template/ui/components/label'
import { Button } from '@template/ui/components/button'

const defaultFormValue = {
  email: '',
  name: '',
  password: '',
}

enum ActionKind {
  EMAIL = 'email',
  NAME = 'name',
  PASSWORD = 'password',
}
interface Action {
  type: ActionKind
  value: string
}

function reducer(state: typeof defaultFormValue, action: Action) {
  switch (action.type) {
    case 'email':
      return { ...state, email: action.value }
    case 'name':
      return { ...state, name: action.value }
    case 'password':
      return { ...state, password: action.value }
    default:
      throw new Error('Invalid action type')
  }
}

const Demo = () => {
  const trpc = useTRPC()
  const [signInState, setSignInState] = useState(false)
  const [signOutState, setSignOutState] = useState(false)
  const [state, dispatch] = useReducer(reducer, defaultFormValue)
  const data = useQuery(trpc.hello.queryOptions({ name: 'John Doe' }))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(state)
    const { data, error } = await authClient.signUp.email({
      email: state.email,
      name: state.name,
      password: state.password,
    })
    console.log(data, error)
    if (data?.user) {
      setSignInState(true)
    }
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(state)
    const { data, error } = await authClient.signIn.email({
      email: state.email,
      password: state.password,
    })
    console.log(data, error)
    if (data?.user) {
      setSignInState(false)
      setSignOutState(true)
    }
  }

  const handleSignOut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(state)
    const { data, error } = await authClient.signOut()
    console.log(data, error)
    if (data) {
      setSignOutState(false)
    }
  }

  return (
    <>
      <div className="mb-10 flex items-center justify-center">
        <h1>{data.isLoading && 'Loading...'}</h1>
        {data.data && <p>{JSON.stringify(data.data, null, 2)}</p>}
      </div>

      {!signInState && !signOutState && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-4 space-y-4"
        >
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            value={state.email}
            onChange={(e) =>
              dispatch({ type: ActionKind.EMAIL, value: e.target.value })
            }
          />
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Name"
            value={state.name}
            onChange={(e) =>
              dispatch({ type: ActionKind.NAME, value: e.target.value })
            }
          />
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={state.password}
            onChange={(e) =>
              dispatch({ type: ActionKind.PASSWORD, value: e.target.value })
            }
          />
          <Button type="submit">Submit</Button>
        </form>
      )}
      {signInState && !signOutState && (
        <form
          onSubmit={handleSignIn}
          className="flex flex-col items-center justify-center gap-4 space-y-4"
        >
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            value={state.email}
            onChange={(e) =>
              dispatch({ type: ActionKind.EMAIL, value: e.target.value })
            }
          />
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={state.password}
            onChange={(e) =>
              dispatch({ type: ActionKind.PASSWORD, value: e.target.value })
            }
          />
          <Button type="submit">Submit</Button>
        </form>
      )}
      {signOutState && (
        <form
          onSubmit={handleSignOut}
          className="flex flex-col items-center justify-center gap-4 space-y-4"
        >
          <Button type="submit">SignOut</Button>
        </form>
      )}
    </>
  )
}

export default Demo
