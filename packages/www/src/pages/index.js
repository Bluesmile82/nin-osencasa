import React, { useState } from 'react';
import { Container, Flex, Input, Box, Label } from 'theme-ui';
import { gql, useQuery } from '@apollo/client';
import InputRange from 'react-input-range';
import Nav from '../components/Nav';
import Seo from '../components/Seo';
import '../../styles/index.scss';
import StarRatingComponent from 'react-star-rating-component';
import casaImg from '../images/casas.png';
import crownImg from '../images/cor.png';

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
  const { loading, error, data } = useQuery(GET_IDEAS);
  const parseLinks = (text) => {
    return text
      .replace(
        /(http.*)\s?/g,
        t => `<a href="${t}" target="_blank">${t}</a></br>`
      )
  };

  const ViewIdeas = () => {
    const [search, setSearch] = useState('');
    const [ageValue, setAgeValue] = useState({ min: 1, max: 16 });
    const filteredIdeas =
      !loading &&
      !error &&
      data.ideas
        .filter(idea =>
          search
            ? idea.title.toLowerCase().includes(search.toLowerCase()) ||
              (idea.description &&
                idea.description.toLowerCase().includes(search.toLowerCase()))
            : true
        )
        .filter(
          idea => (ageValue.max <= idea.ageMax) || ageValue.min <= idea.ageMax && ageValue.max >= idea.ageMin)
        );
    return (
      <Flex sx={{ flexDirection: 'column' }}>
        {loading && <div>Loading...</div>}
        {error && <div>{error.message}</div>}
        {!loading && !error && (
          <>
            <Input
              sx={{ margin: '30px 0' }}
              placeholder="Busca ..."
              onChange={term => setSearch(term.target.value)}
            />
            <Label
              sx={{
                display: 'flex',
                marginBottom: 3,
                paddingRight: 2,
                justifyContent: 'space-between'
              }}
            >
              <span style={{ 'margin-right': '20px' }}>Edad</span>
              <InputRange
                maxValue={16}
                minValue={1}
                name={'age-filter'}
                value={ageValue}
                onChange={e => setAgeValue(e)}
                allowSameValues
              />
            </Label>
            <div>{filteredIdeas.length} ideas</div>
            <ol>
              {filteredIdeas.map(
                idea =>
                  idea.reviewed && (
                    <li>
                      <Box p={3} key={idea.title}>
                        <h3>{idea.title}</h3>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: parseLinks(idea.description)
                          }}
                        />
                        <div>
                          {idea.participantsMin}{' '}
                          {idea.participantsMax &&
                          idea.participantsMin !== idea.participantsMax
                            ? `a ${idea.participantsMax} `
                            : ' '}
                          participantes
                        </div>
                        <div>
                          {' '}
                          Para {idea.ageMin}{' '}
                          {idea.ageMax && idea.ageMin !== idea.ageMax
                            ? `a ${idea.ageMax} `
                            : ' '}
                          años
                        </div>
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
                    </li>
                  )
              )}
            </ol>
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
      <h1 className="title">Ideas y actividades para hacer con los niños en casa</h1>
      <div className="house-container">
        <img src={crownImg} title="crown" className="image-crown left"/>
        <img src={casaImg} title="casa" />
        <img src={crownImg} title="crown" className="image-crown right"/>
      </div>
      <div>
        Ideas para pasar la cuarentena y  que los
        niños se diviertan. Para disfrutar en familia o actividades para entretenerlos mientras los padres siguen sus labores diarias. Aqui encontrarás actividades como juegos y
        manualidades que te ayudaran a pasar un gran tiempo.
      </div>
      <ViewIdeas />
    </Container>
  );
}