import React from 'react';
import { Flex, NavLink } from 'theme-ui';
import { Link } from '@reach/router';

const Nav = () => {
  return (
    <Flex as="nav">
      <NavLink as={Link} to="/" pt={2} pr={3}>
        Niños en Casa
      </NavLink>
      <NavLink as={Link} to="/ideas" pr={3} pt={2}>
        Ideas
      </NavLink>
    </Flex>
  );
};


export default Nav;
