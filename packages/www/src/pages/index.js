import React, { useState } from 'react';
import { Container, Flex, Input, Box } from 'theme-ui';
import { gql, useQuery } from '@apollo/client';
import Nav from '../components/Nav';
import Seo from '../components/Seo';
import firstIdeas from '../../../static/firstIdeas.json'
import '../../styles/index.scss';

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
  const { loading, error, data } = useQuery(GET_IDEAS);

  const ViewIdeas = () => {
    const [search, setSearch] = useState('');
    return (
      <Flex sx={{ flexDirection: 'column' }}>
        {loading && <div>Loading...</div>}
        {error && <div>{error.message}</div>}
        {!loading && !error && (
          <>
            <Input
              placeholder="Busca ..."
              onChange={term => setSearch(term.target.value)}
            />
            {data.ideas
              .filter(idea =>
                search ? idea.title.startsWith(search) : true
              )
              .map(idea => (
                <Box p={3} key={idea.title}>
                  <h3>{idea.title}</h3>
                  <div>{idea.description}</div>
                </Box>
              ))
            }
          </>
        )}
      </Flex>
    );
  };
  return (
    <Container>
      <Seo
        title="Inicio"
        description="Ideas y actividades para hacer con los niños en casa"
      />
      <Nav />
      <h1>Ideas y actividades para hacer con los niños en casa</h1>
      <div>
        Estas actividades como juegos, manualidades, cocina te ayudarán para
        pasar un gran tiempo con los niños o a que se entretengan
      </div>
      <ViewIdeas />
      {firstIdeas.map(i => (
        <Box p={3} key={i.title}>
          <h3>{i.title}</h3>
          <div>{i.description}</div>
        </Box>
      ))}
    </Container>
  );
}