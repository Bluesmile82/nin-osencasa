import { Router, Link } from '@reach/router';
import React, { useState } from 'react';
import {
  Container,
  Heading,
  Flex,
  Input,
  NavLink,
  Button,
  Box,
} from 'theme-ui';
import { gql, useQuery, useMutation } from '@apollo/client';
import Nav from '../components/Nav';
import Seo from '../components/Seo';
import Form from '../components/Form';
import '../../styles/ideas.scss';
import StarRatingComponent from 'react-star-rating-component';

const GET_IDEAS = gql`
  query GetIdeas {
    ideas {
      id
      title
      activity
      description
      participants
      duration
      reviewed
    }
  }
`;

  const REVIEW_IDEA = gql`
    mutation ReviewIdea($id: ID!) {
      reviewIdea(id: $id) {
        id
        reviewed
      }
    }
  `;

  const DELETE_IDEA = gql`
    mutation DeleteIdea($id: ID!) {
      deleteIdea(id: $id) {
        id
      }
    }
  `;

export default () => {
  const { loading, error, data, refetch } = useQuery(GET_IDEAS);
  const [reviewIdea] = useMutation(REVIEW_IDEA);
  const [deleteIdea] = useMutation(DELETE_IDEA);

  const ViewIdeas = () => {
    const [search, setSearch] = useState('');
    return (
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
              {data.ideas &&
                data.ideas
                  .filter(idea =>
                    search ? idea.title.startsWith(search) : true
                  )
                  .map(idea => (
                    <li key={idea.id}>
                      <NavLink as={Link} to={`/ideas/${idea.id}`} p={2}>
                        {idea.title}
                      </NavLink>
                      <NavLink as={Link} to={`/ideas/edit/${idea.id}`} p={2}>
                        Edit
                      </NavLink>
                      {!idea.reviewed && (
                        <Button
                          onClick={async () => {
                            await reviewIdea({ variables: { id: idea.id } });
                            await refetch();
                          }}
                          p={2}
                        >
                          Review
                        </Button>
                      )}
                      <Button
                        onClick={async () => {
                          await deleteIdea({ variables: { id: idea.id } });
                          await refetch();
                        }}
                        p={2}
                      >
                        Delete
                      </Button>
                    </li>
                  ))}
            </ol>
          </>
        )}
      </Flex>
    );
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
                <div>{idea.activity}</div>
                <div>{idea.participants}</div>
                <div>{idea.description}</div>
              </Flex>
            </Box>
            <StarRatingComponent
              name={'edit-duration'}
              value={idea.duration}
              editing={false}
            />
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
        <Seo
          title="Crea tu idea"
          description="Añade a la lista de ideas y actividades para hacer con los niños en casa"
        />
        <Nav />
        <Flex sx={{ flexDirection: 'column', ialign: 'right' }}>
          <Heading as="h1" sx={{ marginBottom: 3 }}>
            Ideas
          </Heading>
          <Form refetch={refetch} />
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
