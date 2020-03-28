import React from 'react';
import { Container, Box } from 'theme-ui';
import { gql, useQuery } from '@apollo/client';
import Nav from '../components/Nav';
import Seo from '../components/Seo';
import ViewIdeas from '../components/ViewIdeas';
import SenderForm from '../components/SenderForm/SenderForm';
import '../../styles/index.scss';
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
  return (
    <Container p={3}>
      <Seo
        title="Inicio"
        description="Ideas y actividades para hacer con los niños en casa"
      />
      <Nav />
      <h1 className="title">
        {!loading && !error && `${data.ideas.filter(i => i.reviewed).length} `}
        Ideas y actividades para hacer con los niños y niñas en casa
      </h1>
      <div className="house-container">
        <img
          src={crownImg}
          alt="decoración"
          title="crown"
          className="image-crown left"
        />
        <img src={casaImg} alt="casa" title="casa" />
        <img
          src={crownImg}
          alt="decoración"
          title="crown"
          className="image-crown right"
        />
      </div>
      <div>
        Ideas para pasar la cuarentena y que los niños y niñas se diviertan.
        Para disfrutar en familia o actividades para entretenerlos mientras los
        padres y madres siguen sus labores diarias. Aqui encontrarás actividades
        como juegos y manualidades que te ayudaran a pasar un gran tiempo.
      </div>
      <SenderForm />
      <ViewIdeas loading={loading} error={error} data={data} />
      <Box sx={{ textAlign: 'left' }}>
        Álvaro Leal 2020 -{' '}
        <a target="_blank" href="http://www.alvaro-leal.com">
          Contacto
        </a>
      </Box>
    </Container>
  );
}