import { useRef, useState } from 'react'
import {
  useDisclosure,
  Input,
  Button,
  Select,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useGet } from '@/hooks/useGet'
import { validateEmail } from '@/utils'
import { usePost } from '@/hooks/usePost'

type Props = {
  onSave: () => void
}

const initialValues = {
  email: '',
  project: undefined,
}

const initialError = {
  email: {
    message: '',
    error: false,
  },
  project: {
    message: '',
    error: false,
  },
}
export default function DashboardDrawer({ onSave }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const [values, setValues] = useState(initialValues)
  const [isError, setIsError] = useState(initialError)
  const { projects } = useGet('/api/projects')
  const { sendData } = usePost('/api/users')

  const handleOnChange = (e) => {
    setValues((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
    setIsError(initialError)
  }

  const handleOnSave = () => {
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

    if (!values.project) {
      setIsError({
        ...isError,
        project: {
          message: 'Field is required.',
          error: true,
        },
      })
      return
    }

    sendData({ email: values.email, projectId: values.project }).then(() => {
      setValues(initialValues)
      onClose()
      onSave()
    })
  }

  return (
    <>
      <Button
        leftIcon={<AddIcon />}
        ref={btnRef}
        colorScheme="teal"
        onClick={onOpen}
      >
        Add
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add user</DrawerHeader>

          <DrawerBody>
            <FormControl
              mb={6}
              isInvalid={isError.email.error || isError.project.error}
            >
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                mb={6}
                placeholder="User email"
                type="email"
                value={values.email}
                onChange={handleOnChange}
              />
              {isError.email.error && (
                <FormErrorMessage>{isError.email.message}</FormErrorMessage>
              )}

              <FormLabel mt={3}>Project</FormLabel>
              <Select
                name="project"
                placeholder="Select project"
                value={values.project}
                onChange={handleOnChange}
              >
                {projects?.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Select>
              {isError.project.error && (
                <FormErrorMessage>{isError.project.message}</FormErrorMessage>
              )}
            </FormControl>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleOnSave}>
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
