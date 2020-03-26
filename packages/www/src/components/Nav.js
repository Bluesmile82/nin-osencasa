import React from 'react';
import { Flex, NavLink } from 'theme-ui';
import { Link } from '@reach/router';

const Nav = () => {
  return (
    <Flex as="nav">
      <NavLink as={Link} to="/" pt={2} pr={3}>
        Inicio
      </NavLink>
      <NavLink as={Link} to="/random" pt={2} pr={3}>
        Idea aleatoria
      </NavLink>
      <NavLink as={Link} to="/ideas" pr={3} pt={2}>
        Añade tu idea
      </NavLink>
    </Flex>
  );
};


export default Nav;
