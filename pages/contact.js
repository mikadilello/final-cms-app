import React, { useState, useEffect } from 'react';
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

const Event = () => {
    const AuthUser = useAuthUser()
    const [inputName, setInputName] = useState('')
    const [inputMail, setInputMail] = useState('')
    const [inputCell, setInputCell] = useState('')
    const [inputAddress, setInputAddress] = useState('')
    const [events, setEvents] = useState([])


    useEffect(() => {
        AuthUser.id &&
            firebase
                .firestore()
                .collection("contacts")
                .where( 'user', '==', AuthUser.id )
                .onSnapshot(
                  snapshot => {
                    setEvents(
                      snapshot.docs.map(
                        doc => {
                          return {
                            eventID: doc.id,
                            eventName: doc.data().name,
                            eventMail: doc.data().mail,
                            eventCell: doc.data().cell,
                            eventAddress: doc.data().address
                          }}));
                })
    })

    const sendData = () => {
        try {
            // try to update doc
            firebase
                .firestore()
                .collection("contacts") // all users share one collec
                .add({
                    name: inputName,
                    mail: inputMail,
                    cell: inputCell,
                    address: inputAddress,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    user: AuthUser.id
                })
                .then(console.log('Data was successfully sent to cloud firestore!'))
            // flush out the user entered values in the input elements on onscreen
            setInputName('');
            setInputMail('');
            setInputCell('');
            setInputAddress('');
        } catch (error) {
            console.log(error)
        }
    }

    const deleteEvent = (t) => {
        try {
            firebase
                .firestore()
                .collection("contacts")
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
                <Heading mb={4} pb={4} mt={-10}>Contacts</Heading>

            </Flex>

            <InputGroup>
                <InputLeftElement
                    pointerEvents="none"
                    children={<AddIcon color="gray.300" />}
                />
                <Input type="text" value={inputName} onChange={(e) => setInputName(e.target.value)} placeholder="Contact Name" />
                <Input type="text" value={inputMail} onChange={(e) => setInputMail(e.target.value)} placeholder="Contact E-mail" />
                <Input type="text" value={inputCell} onChange={(e) => setInputCell(e.target.value)} placeholder="Contact Phone Number" />
                <Input type="text" value={inputAddress} onChange={(e) => setInputAddress(e.target.value)} placeholder="Contact Address" />
                <Button
                    ml={2} px={6}
                    onClick={() => sendData()}
                >
                    Add
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
                                <Text><Link href={'/contacts/' + item.eventID}>{item.eventName}</Link></Text>
                                <Text>... {item.eventMail}</Text>
                                <Text>... {item.eventCell}</Text>
                                <Text>... {item.eventAddress}</Text>
                            </Flex>
                            <IconButton onClick={() => deleteEvent(item.eventId)} icon={<DeleteIcon />} />
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
})(Event)