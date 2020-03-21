import React, { useState } from 'react';
import { Container, Flex, Input, Box } from 'theme-ui';
import { gql, useQuery } from '@apollo/client';
import Nav from '../components/Nav';
import Seo from '../components/Seo';
import '../../styles/index.scss';
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
              sx={{ marginTop: '30px' }}
              placeholder="Busca ..."
              onChange={term => setSearch(term.target.value)}
            />
            {data.ideas
              .filter(idea =>
                search
                  ? idea.title.toLowerCase().includes(search.toLowerCase()) ||
                    idea.description && idea.description
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  : true
              )
              .map(idea => (
                <Box p={3} key={idea.title}>
                  <h3>{idea.title}</h3>
                  <div>{idea.description}</div>
                  {idea.duration && (
                    <div>
                      Duración:
                      <StarRatingComponent
                        className="stars"
                        name={'index-duration'}
                        value={idea.duration}
                        editing={false}
                      />
                    </div>
                  )}
                </Box>
              ))}
          </>
        )}
      </Flex>
    );
  };
  return (
    <Container p={3}>
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
    </Container>
  );
}