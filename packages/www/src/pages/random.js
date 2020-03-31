import { Router, Link } from '@reach/router';
import React from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Container,
  Flex,
  NavLink
} from 'theme-ui';
import Nav from '../components/Nav';
import Seo from '../components/Seo';
import ViewIdea from '../components/ViewIdea';
import '../../styles/ideas.scss';

const GET_IDEAS = gql`
  query GetIdeas {
    ideas {
      id
      title
      activity
      description
      participantsMin
      participantsMax
      ageMin
      ageMax
      duration
      reviewed
    }
  }
`;
export default () => {
  const RandomIdea = () => {
    const { loading, error, data } = useQuery(GET_IDEAS);
    const filteredIdeas = !loading && !error && data.ideas.filter(idea => idea.reviewed);
    const randomIdea =
      filteredIdeas[Math.floor(Math.random() * filteredIdeas.length)];
    return (
      <Container p={3} sx={{ height: '100vh' }}>
        <Seo
          title="Idea aleatoria"
          description="Una idea aleatoria para hacer con los niños en casa"
        />
        <Nav />
        <Flex sx={{ flexDirection: 'column', align: 'right' }}>
          <h1>Una idea aleatoria</h1>
          <NavLink as={Link} to={`/random`} p={3}>
            Ver otra idea
          </NavLink>
          {randomIdea && <ViewIdea idea={randomIdea} />}
        </Flex>
      </Container>
    );
  };

  return (
    <Router>
      <RandomIdea path="/random" />
    </Router>
  );
}
