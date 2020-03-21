import { Router } from '@reach/router';
import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Container,
  Flex,
  Box
} from 'theme-ui';
import Nav from '../components/Nav';
import Seo from '../components/Seo';
import Form from '../components/Form';
import '../../styles/ideas.scss';

const GET_IDEAS = gql`
  query GetIdeas {
    ideas {
      id
    }
  }
`;

export default () => {
  const Ideas = () => {
    const { refetch } = useQuery(GET_IDEAS);
    const [isSent, setIsSent] = useState(false);
    return (
      <Container p={3}>
        <Seo
          title="Crea tu idea"
          description="Añade a la lista de ideas y actividades para hacer con los niños en casa"
        />
        <Nav />
        <Flex sx={{ flexDirection: 'column', align: 'right' }}>
          <h1>Añade tu idea</h1>
          <Form onSend={() => setIsSent(true)} refetch={refetch} />
          {isSent && (
            <Box p={4}>
              <span role="img" aria-label="ok">
                ✔️
              </span>{' '}
              Tu idea se ha enviado. Tras una revisión la añadiremos a las demás{' '}
              <span role="img" aria-label="smile">
                😊
              </span>
            </Box>
          )}
        </Flex>
      </Container>
    );
  };

  return (
    <Router>
      <Ideas path="/ideas" />
    </Router>
  );
}
