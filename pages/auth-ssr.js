import React from 'react'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import FirebaseAuth from '../components/FirebaseAuth'
import DarkModeSwitch from '../components/DarkModeSwitch'

const styles = {
  content: {
    padding: `8px 32px`,
    marginTop: 16,
  },
  textContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: 16,
  },
  top: {
    display: 'inline',
    padding: 16,
    fontSize: 32,
    verticalAlign: 'middle',
  },
}

const Auth = () => (
  <div style={styles.content}>
  <div><h3 style={styles.top}>Sign-in Page</h3><DarkModeSwitch  style={styles.top} /></div>
    <div style={styles.textContainer}>
      <p>
        This auth page is <b>not</b> static. It will server-side redirect to the
        app if the user is already authenticated.
      </p>
    </div>
    <div>
      <FirebaseAuth />
    </div>
  </div>
)

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})()

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(Auth)
