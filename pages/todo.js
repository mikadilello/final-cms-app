import React, { useState, useEffect } from 'react'
import { Flex, Heading, InputGroup, InputLeftElement, Input, Button, Text, IconButton, Divider, Link,
} from "@chakra-ui/react";
import DarkModeSwitch from '../components/DarkModeSwitch';
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction,
} from 'next-firebase-auth';
import getAbsoluteURL from '../utils/getAbsoluteURL';
import { AddIcon, DeleteIcon, StarIcon } from "@chakra-ui/icons";
import firebase from 'firebase/app';
import 'firebase/firestore';
import Header from '../components/Header';

const Todo = () => {
    const AuthUser = useAuthUser()
    const [inputTodo, setInputTodo] = useState('')
    const [events, setEvents] = useState([])

    // console.log(AuthUser)
    // console.log(todos)
    
        useEffect(() => {
        AuthUser.id &&
            firebase
                .firestore()
                .collection("todos")
                .where( 'user', '==', AuthUser.id )
                .onSnapshot(
                  snapshot => {
                    setEvents(
                      snapshot.docs.map(
                        doc => {
                          return {
                            eventID: doc.id,
                            eventTodo: doc.data().todo
                          }}));
                })
    })
    
        const sendData = () => {
        try {
            // try to update doc
            firebase
                .firestore()
                .collection("todos") // all users share one collec
                .add({
                    todo: inputTodo,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    user: AuthUser.id
                })
                .then(console.log('Data was successfully sent to cloud firestore!'))
            // flush out the user entered values in the input elements on onscreen
            setInputTodo('');
        } catch (error) {
            console.log(error)
        }
    }

    const deleteTodo = (t) => {
        try {
            firebase
                .firestore()
                .collection("todos")
                .doc(t)
                .delete()
                .then(console.log('Data was successfully deleted!'))
        } catch (error) {
            console.log(error)
        }
    }

    return (
      <div>
        <Header email={AuthUser.email} signOut={AuthUser.signOut} />
        <Flex flexDir="column" maxW={800} align="center" justify="center" minH="60vh" m="auto" px={4}>
            <Flex justify="space-between" w="100%" align="center">
                <Heading mb={4} pb={4} mt={10}>Todos</Heading>
            </Flex>

            <InputGroup>
                <InputLeftElement
                    pointerEvents="none"
                    children={<AddIcon color="gray.300" />}
                />
                <Input type="text" value={inputTodo} onChange={(e) => setInputTodo(e.target.value)} placeholder="Learn Chakra-UI & Next.js" />
                <Button
                    ml={2}
                    onClick={() => sendData()}
                >
                    Add Todo
                </Button>
            </InputGroup>

            {events.map((item, i) => {
                return (
                    <React.Fragment key={i}>
                        {i > 0 && <Divider />}
                        <Flex
                            w="100%"
                            p={5}
                            my={2}
                            align="center"
                            borderRadius={5}
                            justifyContent="space-between"
                        >
                            <Flex align="center">
                                <Text fontSize="xl" mr={4}>{i + 1}.</Text>
                                <Text><Link href={'/todos/' + item.eventID}>
                                {item.eventTodo}</Link></Text>
                            </Flex>
                            <IconButton onClick={() => deleteTodo(item.eventID)} icon={<DeleteIcon />} />
                        </Flex>
                    </React.Fragment>
                )
            })}
            <Button style={{ backgroundColor: 'rgba(118,118,148,.25)' }}><a href="/" style={{ fontSize: "25px"}} p={2}>Go home</a></Button>
        </Flex>
        </div>
    )
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
    return {
        props: {
        }
    }
})

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
})(Todo)