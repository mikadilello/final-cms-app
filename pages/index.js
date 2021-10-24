import React from 'react';
import { useAuthUser, withAuthUser, withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Header from '../components/Header';
import DemoPageLinks from '../components/DemoPageLinks';
import { Box, } from '@chakra-ui/react';

const styles = {
  content: {
    padding: 32,
  },
  infoTextContainer: {
    marginBottom: 32,
  },
  bigFont: {
    fontSize: 18,
  },
  biggerFont: {
    fontSize: 20,
  },
}

const Home = () => {
  const AuthUser = useAuthUser()
  return (
    <div>
      <Header
        email={AuthUser.email} signOut={AuthUser.signOut} />
      <div style={styles.content}>
        <div style={styles.infoTextContainer}>
          <h2 p={2} style={styles.biggerFont}>Welcome to the Full Stack App!</h2>
          <br></br>
          <p p={4} style={styles.bigFont}>With a user account, you can keep track of <a href="/todo" style={{ textDecoration: 'underline' }}>what you need to do</a>, <a href="/event" style={{ textDecoration: 'underline' }}>upcoming events</a>, and <a href="/contact" style={{ textDecoration: 'underline' }}>your contacts!</a></p>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser()(Home)