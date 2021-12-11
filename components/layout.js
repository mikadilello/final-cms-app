import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Header from './Header';
import DemoPageLinks from './DemoPageLinks';
import { Box, } from '@chakra-ui/react';
import { useAuthUser, withAuthUser, withAuthUserTokenSSR,
} from 'next-firebase-auth';

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

export default function Layout( { children, home } ) {
  const AuthUser = useAuthUser()
  return (
    <div>
      <Header
        email={AuthUser.email} signOut={AuthUser.signOut} />
      <main>{children}</main>
      {!home && (
          <Link href="/">
            <a style={styles.content} className="btn btn-primary mt-3">← Back to home</a>
          </Link>
        )
      }
      
    </div>
  );
}
