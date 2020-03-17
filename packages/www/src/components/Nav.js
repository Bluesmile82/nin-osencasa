import React from 'react';
import { Flex, NavLink } from 'theme-ui';
import { Link } from '@reach/router';

const Nav = () => (
  <Flex as="nav" sx={{ justifyContent: 'space-between' }}>
    <NavLink as={Link} to="/ideas" p={2}>
      Ideas
    </NavLink>
  </Flex>
);

export default Nav;
