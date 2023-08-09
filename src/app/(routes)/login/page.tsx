'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react'
import { usePost } from '@/hooks/usePost'
import { validateEmail } from '@/utils'

const initialValues = {
  email: '',
  password: '',
}

const initialError = {
  email: {
    message: '',
    error: false,
  },
  password: {
    message: '',
    error: false,
  },
}
export default function Login() {
  const { push } = useRouter()
  const [values, setValues] = useState(initialValues)
  const [isError, setIsError] = useState(initialError)
  const { sendData } = usePost('/api/login')

  const handleInputChange = (e) => {
    setValues((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
    setIsError(initialError)
  }
  const handleClick = () => {
    if (!validateEmail(values.email)) {
      setIsError({
        ...isError,
        email: {
          message: 'Wrong email.',
          error: true,
        },
      })
      return
    }

    if (!values.password) {
      setIsError({
        password: {
          message: 'Field is required.',
          error: true,
        },
      })
      return
    }

    const { email, password } = values
    sendData({ email, password }).then(() => push('/dashboard'))
  }
  return (
    <Flex h="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" bg="gray.100" p={12} rounded={6}>
        <Heading mb={6}>Log in</Heading>
        <FormControl
          mb={6}
          isInvalid={isError.email.error || isError.password.error}
        >
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            placeholder="email"
            variant="filled"
            type="email"
            value={values.email}
            onChange={handleInputChange}
          />
          {isError.email.error && (
            <FormErrorMessage>{isError.email.message}</FormErrorMessage>
          )}

          <FormLabel mt={3}>Password</FormLabel>
          <Input
            name="password"
            placeholder="password"
            variant="filled"
            type="password"
            value={values.password}
            onChange={handleInputChange}
          />
          {isError.password.error && (
            <FormErrorMessage>{isError.password.message}</FormErrorMessage>
          )}
        </FormControl>
        <Button colorScheme="teal" onClick={handleClick}>
          Log in
        </Button>
      </Flex>
    </Flex>
  )
}
