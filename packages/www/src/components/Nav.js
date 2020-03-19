import React from 'react';
import { Flex, NavLink } from 'theme-ui';
import { Link } from '@reach/router';

const Nav = () => (
  <Flex as="nav">
    <NavLink as={Link} to="/" pt={2} pr={3}>
      Niños en Casa
    </NavLink>
    <NavLink as={Link} to="/ideas" pt={2}>
      Ideas
    </NavLink>
  </Flex>
);

export default Nav;
