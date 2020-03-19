import { Router, Link } from '@reach/router';
import React, { useState } from 'react';
import {
  Container,
  Heading,
  Flex,
  Input,
  NavLink,
  Box,
} from 'theme-ui';
import { gql, useQuery } from '@apollo/client';
import Nav from '../components/Nav';
import Form from '../components/Form';
import '../../styles/ideas.scss';

const GET_IDEAS = gql`
  query GetIdeas {
    ideas {
      id
      title
      author
      activity
      description
      participants
      duration
    }
  }
`;

export default () => {
  const { loading, error, data, refetch } = useQuery(GET_IDEAS);

  const ViewIdeas = () => {
    const [search, setSearch] = useState('');
    return(
      <Flex sx={{ flexDirection: 'column' }}>
        {loading && <div>Loading...</div>}
        {error && <div>{error.message}</div>}
        {!loading && !error && (
          <>
            <Input
              placeholder="Busca..."
              onChange={term => setSearch(term.target.value)}
            />
            <ol>
              {data.ideas && data.ideas
                .filter(idea => (search ? idea.title.startsWith(search) : true))
                .map(idea => (
                  <li activity={idea.id}>
                    <NavLink as={Link} to={`/ideas/${idea.id}`} p={2}>
                      {idea.title}
                    </NavLink>
                    <NavLink as={Link} to={`/ideas/edit/${idea.id}`} p={2}>
                      Edit
                    </NavLink>
                  </li>
                ))}
            </ol>
          </>
        )}
      </Flex>
    )
  };

  const viewIdea = (id) => {
    const idea = data && data.ideas.find(s => s.id === id);
    return (
      <Flex sx={{ flexDirection: 'column' }}>
        {loading && <div>Loading...</div>}
        {error && <div>{error.message}</div>}
        {!loading && !error && idea && (
          <Flex sx={{ flexDirection: 'column' }}>
            <Box p={2} color="white" bg="primary" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                <h1>{idea.title}</h1>
                <div>{idea.author}</div>
              </span>
              <div>{idea.participants}</div>
              <div>{idea.activity}</div>
            </Box>
            <Box p={4}>
              <Flex
                sx={{
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Box sx={{ whiteSpace: 'pre-line' }}>{idea.description}</Box>
              </Flex>
            </Box>
            {idea.duration}
            <NavLink as={Link} to={`/ideas/edit/${idea.id}`} p={2}>
              Edit
            </NavLink>
          </Flex>
        )}
      </Flex>
    );
  }

  const editIdea = (id) => {
    const idea = data && data.ideas.find(s => s.id === id);
    return (
      <Flex sx={{ flexDirection: 'column' }}>
        {loading && <div>Loading...</div>}
        {error && <div>{error.message}</div>}
        {!loading && !error && idea && (
          <Flex sx={{ flexDirection: 'column' }}>
            <Box p={2} color="white" bg="primary">
              {idea.title}
            </Box>
            <Box p={4}>
              <Flex
                sx={{
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <div>{idea.author}</div>
                <div>{idea.activity}</div>
                <div>{idea.participants}</div>
                <div>{idea.description}</div>
              </Flex>
            </Box>
            {idea.duration}
            <Form currentItem={idea} refetch={refetch} />
          </Flex>
        )}
      </Flex>
    );
  }

  let Idea = ({ ideaId }) => {
    return (
      <Container>
        <NavLink as={Link} to={`/ideas/`} p={2}>
          {'<'} Back
        </NavLink>
        {viewIdea(ideaId)}
      </Container>
    );
  }

  let EditIdea = ({ ideaId }) => {
    return (
      <Container>
        <NavLink as={Link} to={`/ideas/`} p={2}>
          {'<'} Back
        </NavLink>
        {editIdea(ideaId)}
      </Container>
    );
  }

  const Ideas = () => {
    return (
      <Container>
        <Nav />
        <Flex sx={{ flexDirection: 'column', ialign: 'right' }}>
          <Heading as="h1" sx={{ marginBottom: 3 }}>
            Ideas
          </Heading>
          <Form refetch={refetch}/>
          <ViewIdeas />
        </Flex>
      </Container>
    );
  };

  return (
    <Router>
      <Ideas path="/ideas" />
      <Idea path="/ideas/:ideaId" />
      <EditIdea path="/ideas/edit/:ideaId" />
    </Router>
  );
}
