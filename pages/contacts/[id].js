import React, { useState, useEffect } from 'react';
import { Flex, Heading, InputGroup, InputLeftElement, Input, Button, Text, IconButton, Divider, Link, } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import { getFirebaseAdmin } from 'next-firebase-auth';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Header from '../../components/Header';

const SingleContact = ({itemData}) => {
  const AuthUser = useAuthUser();
  const [inputName, setInputName] = useState(itemData.name);
  const [inputMail, setInputMail] = useState(itemData.mail);
  const [inputCell, setInputCell] = useState(itemData.cell);
  const [inputAddress, setInputAddress] = useState(itemData.address);
  const [statusMsg, setStatusMsg] = useState('');
  
  const sendData = async () => {
    try {
      console.log("sending!");
      // try to update doc
      const docref = await firebase.firestore().collection("contacts").doc(itemData.id);
      const doc = docref.get();

      if (!doc.empty) {
        docref.update(
          {
            name: inputName,
            mail: inputMail,
            cell: inputCell,
            address: inputAddress
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
          <Input type="text" value={inputName} onChange={(e) => setInputName(e.target.value)} placeholder="Contact Name" />
          <Input type="text" value={inputMail} onChange={(e) => setInputMail(e.target.value)} placeholder="Contact E-mail" />
          <Input type="text" value={inputCell} onChange={(e) => setInputCell(e.target.value)} placeholder="Contact Phone Number" />
          <Input type="text" value={inputAddress} onChange={(e) => setInputAddress(e.target.value)} placeholder="Contact Address" />
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
    const doc = await db.collection("contacts").doc(params.id).get();
    let itemData;
    if (!doc.empty) {
      // document was found
      let docData = doc.data();
      itemData = {
        id: doc.id,
        name: docData.name,
        mail: docData.mail,
        cell: docData.cell,
        address: docData.address
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
)(SingleContact)