import React, { useState, useEffect } from 'react';
import { Flex, Heading, InputGroup, InputLeftElement, Input, Button, Text, IconButton, Divider, Link, } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import { getFirebaseAdmin } from 'next-firebase-auth';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Header from '../../components/Header';

const SingleEvent = ({itemData}) => {
  const AuthUser = useAuthUser();
  const [inputName, setInputName] = useState(itemData.name);
  const [inputDate, setInputDate] = useState(itemData.date);
  const [inputDesc, setInputDesc] = useState(itemData.desc);
  const [statusMsg, setStatusMsg] = useState('');
  
  const sendData = async () => {
    try {
      console.log("sending!");
      // try to update doc
      const docref = await firebase.firestore().collection("events").doc(itemData.id);
      const doc = docref.get();

      if (!doc.empty) {
        docref.update(
          {
            name: inputName,
            date: firebase.firestore.Timestamp.fromDate( new Date(inputDate) ),
            desc: inputDesc
          }
        );
        setStatusMsg("Updated!");
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Header 
        email={AuthUser.email} 
        signOut={AuthUser.signOut} />
      <Flex flexDir="column" maxW={800} align="center" justify="start" minH="100vh" m="auto" px={4} py={3}>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<AddIcon color="gray.300" />}
          />
          <Input type="text" value={inputName} onChange={(e) => setInputName(e.target.value)} placeholder="Event Title" />
          <Input type="text" value={inputDate} onChange={(e) => setInputDate(e.target.value)} placeholder="Event Date" />
          <Input type="text" value={inputDesc} onChange={(e) => setInputDesc(e.target.value)} placeholder="Event Description" />
          <Button
            ml={2}
            onClick={() => sendData()}
          >
            Update
          </Button>
        </InputGroup>
        <Text>
          {statusMsg}
        </Text>
        <Button style={{ backgroundColor: 'rgba(118,118,148,.25)' }}><a href="/event" style={{ fontSize: "25px"}} p={2}>Return to Events</a></Button>
      </Flex>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR(
  {
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
  }
)(
  async ({ AuthUser, params }) => {
    // take the id parameter from the url and construct a db query with it
    const db = getFirebaseAdmin().firestore();
    const doc = await db.collection("events").doc(params.id).get();
    let itemData;
    if (!doc.empty) {
      // document was found
      let docData = doc.data();
      itemData = {
        id: doc.id,
        name: docData.name,
        date: docData.date.toDate().toDateString(),
        desc: docData.desc
      };
    } else {
      // no document found
      itemData = null;
    }
    // return the data
    return {
      props: {
        itemData
      }
    }
  }
)

export default withAuthUser(
  {
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN
  }
)(SingleEvent)