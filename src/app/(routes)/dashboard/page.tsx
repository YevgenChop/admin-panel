'use client'
import {
  Flex,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Button,
} from '@chakra-ui/react'
import { useGet } from '@/hooks/useGet'
import DashboardDrawer from '@/app/_components/DashboardDrawer'
import { useRouter } from 'next/navigation'
import { usePost } from '@/hooks/usePost'

export default function Dashboard() {
  const { push } = useRouter()
  const { user: me } = useGet('/api/me')
  const { users, requestData } = useGet('/api/users')
  const { sendData } = usePost('/api/logout')

  const handleOnSave = () => {
    requestData()
  }

  const handleLogOut = () => {
    sendData().then(() => push('/login'))
  }

  return (
    <Flex
      h={[null, null, '100vh']}
      maxW="2000px"
      flexDir={['column', 'column', 'row']}
      overflow="hidden"
    >
      <Flex
        w={['100%', '100%', '20%', '20%', '20%']}
        flexDir="column"
        alignItems="center"
        backgroundColor="gray.100"
      >
        <Flex
          flexDir="column"
          h={[null, null, '100vh']}
          justifyContent="space-between"
        >
          <Flex
            flexDir="column"
            as="nav"
            justifyContent="space-between"
            h="full"
          >
            <Flex flexDir="column">
              <Heading
                mt={50}
                mb={[25, 50, 100]}
                fontSize={['4xl', '4xl', '2xl', '3xl', '4xl']}
                alignSelf="center"
                letterSpacing="tight"
              >
                Admin Panel
              </Heading>
              <Flex
                flexDir={['row', 'row', 'column', 'column', 'column']}
                align={[
                  'center',
                  'center',
                  'center',
                  'flex-start',
                  'flex-start',
                ]}
                wrap={['wrap', 'wrap', 'nowrap', 'nowrap', 'nowrap']}
                justifyContent="center"
                rounded={6}
                bg="gray.200"
              >
                <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]} w="100%">
                  <Link
                    _hover={{ textDecor: 'none' }}
                    display={['flex', 'flex', 'none', 'flex', 'flex']}
                    w="100%"
                    p={2}
                  >
                    <Text className="active">Users</Text>
                  </Link>
                </Flex>
              </Flex>
            </Flex>
            <Flex
              flexDir="column"
              alignItems="center"
              mb={10}
              mt={5}
              align="flex-end"
            >
              <Button variant="outline" onClick={handleLogOut}>
                Log out
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        w={['100%', '100%', '60%', '60%', '55%']}
        p="3%"
        flexDir="column"
        overflow="auto"
        minH="100vh"
      >
        <Heading fontWeight="normal" mb={4} letterSpacing="tight">
          <Flex display="inline-flex" fontWeight="bold">
            {me?.role === 'admin' ? 'Admin' : 'User'}
          </Flex>
        </Heading>
        <Flex justifyContent="space-between" mt={8}>
          <Flex align="flex-start">
            <Heading as="h2" size="lg" letterSpacing="tight">
              Users
            </Heading>
          </Flex>
          <Flex align="flex-end">
            <DashboardDrawer onSave={handleOnSave} />
          </Flex>
        </Flex>
        <Flex flexDir="column">
          <Flex overflow="auto">
            <Table variant="unstyled" mt={4}>
              <Thead>
                <Tr color="gray">
                  <Th>Id</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users?.map(({ id, email, role }) => {
                  return (
                    <Tr key={id}>
                      <Td>{id}</Td>
                      <Td>{email}</Td>
                      <Td>{role}</Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
