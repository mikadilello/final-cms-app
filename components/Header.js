import React from 'react';
import Link from 'next/link';
import { Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuIcon, MenuCommand, MenuDivider, Button, 
} from "@chakra-ui/react";
import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
import DarkModeSwitch from '../components/DarkModeSwitch';

const nfaDependencyVersion =
  require('../package.json').dependencies['next-firebase-auth']
const nextDependencyVersion = require('../package.json').dependencies.next
const firebaseDependencyVersion =
  require('../package.json').dependencies.firebase

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 16,
    backgroundColor: 'rgba(118,118,148,.25)',
  },
  bigFont: {
    fontSize: 18,
  },
  biggerFont: {
    fontSize: 20,
  },
  button: {
    marginLeft: 0,
    cursor: 'pointer',
  },
  menuItem: {
    margin: 16,
    display: 'inline',
    fontSize: 20,
    paddingTop: 20,
  },
  inline: {
    display: 'inline',
    fontSize: 24,
    fontWeight: 'bold',
    verticalAlign: 'middle',
  },
}

const Header = ({ email, signOut }) => (
  <div style={styles.container}>
    <Menu>
      <div><div style={styles.menuItem}><h1 style={styles.inline}><a href="/">Home</a></h1></div>
      <div style={styles.menuItem}>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} style={styles.biggerFont}>
      Pages
      </MenuButton></div>
      <MenuList style={styles.bigFont}>
        <a href="/todo"><MenuItem>Todos</MenuItem></a>
        <a href="/event"><MenuItem>Events</MenuItem></a>
        <a href="/contact"><MenuItem>Contacts</MenuItem></a>
      </MenuList>
      </div>
    </Menu>
    
    {email ? (
      <>
        <Menu>
          <div><div style={styles.menuItem}><DarkModeSwitch /></div>
          <div style={styles.menuItem}>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} style={styles.biggerFont}>Account</MenuButton>
          </div>
          <MenuList style={styles.bigFont}>
          <MenuItem>Signed in as {email}</MenuItem>
          <MenuItem><button type="button" onClick={() => { signOut() }} style={styles.button}>Sign out</button></MenuItem>
          </MenuList>
          </div>
        </Menu> 
      </>
    ) : (
      <>
        <Menu>

          <div><div style={styles.menuItem}><DarkModeSwitch /></div>
          <div style={styles.menuItem}>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} style={styles.biggerFont}>Account</MenuButton>
          </div>
          <MenuList style={styles.bigFont}>
          <MenuItem>You are not signed in.</MenuItem>
          <MenuItem><Link href="/auth"><a><button type="button" style={styles.button}>Sign in</button></a></Link></MenuItem>
          </MenuList>
          </div>
          
        </Menu>
      </>
    )}
  </div>
)

export default Header
