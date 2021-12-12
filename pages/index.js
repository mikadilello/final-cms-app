import React from 'react';
import { useAuthUser, withAuthUser, withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Header from '../components/Header';
import DemoPageLinks from '../components/DemoPageLinks';
import { Box, } from '@chakra-ui/react';
import { getSortedList } from './lib/data';
import Link from 'next/link';

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

export async function getStaticProps() {
  const allData = await getSortedList();
  return {
    props: {
      allData
    },
    revalidate: 60
  }
}

const Home = ({ allData }) => {
  const AuthUser = useAuthUser()
  return (
    <>
      <Header
        email={AuthUser.email} signOut={AuthUser.signOut} />
      <div style={styles.content}>
        <div style={styles.infoTextContainer}>
          <h2 p={2} style={styles.biggerFont}>Welcome to the Full Stack App!</h2>
          <br></br>
          <div p={4} style={styles.bigFont}>With a user account, you can keep track of <a href="/todo" style={{ textDecoration: 'underline' }}>what you need to do</a>, <a href="/event" style={{ textDecoration: 'underline' }}>upcoming events</a>, and <a href="/contact" style={{ textDecoration: 'underline' }}>your contacts!</a></div>
          <br></br>
          <h2 p={2} style={styles.biggerFont}>List of Posts</h2>
          <br></br>
          <div className="list-group">
            {allData.map(({ id, name }) => (
              <div p={4} style={styles.bigFont}>
              <Link key={id} href={`/${id}`}>
                <a className="list-group-item list-group-item-action" style={{ textDecoration: 'underline' }}>{name}</a>
              </Link></div>
              
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

// export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser()(Home)