import { Router } from '@reach/router';
import React, { useState } from 'react';
import {
  Container,
  Heading,
  Flex,
  Box
} from 'theme-ui';
import Nav from '../components/Nav';
import Seo from '../components/Seo';
import Form from '../components/Form';
import '../../styles/ideas.scss';

export default () => {
  const Ideas = () => {
    const [isSent, setIsSent] = useState(false);
    return (
      <Container>
        <Seo
          title="Crea tu idea"
          description="Añade a la lista de ideas y actividades para hacer con los niños en casa"
        />
        <Nav />
        <Flex sx={{ flexDirection: 'column', ialign: 'right' }}>
          <Heading as="h1" sx={{ marginBottom: 3 }}>
            Añade tu idea
          </Heading>
          <Form onSend={() => setIsSent(true)} />
          {isSent && (
            <Box p={4}>
              <span role="img">✔️</span> Tu idea se ha enviado. Tras una
              revisión la añadiremos a las demás <span role="img">😊</span>
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
