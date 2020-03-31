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
import {
  FacebookShareButton,
  TwitterShareButton,
  PinterestShareButton,
  TelegramShareButton,
  WhatsappShareButton
} from 'react-share';
import {
  FacebookIcon,
  PinterestIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';
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
  const ideasNumber = !loading && !error && (data.ideas.filter(i => i.reviewed).length - 1) || '';
  const title = `${ideasNumber} Ideas y actividades para hacer con los niños y niñas en
        casa ¡Añade la tuya!`;
  return (
    <Container p={3}>
      <Seo
        title="Inicio"
        description="Ideas y actividades para hacer con los niños en casa"
      />
      <Nav />
      <h1 className="title">{title}</h1>
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
      <div>
        ¿Te parece una buena idea? ¡Compártelo en tus redes!
        <FacebookShareButton
          className="sharing-button"
          url={'http://www.niñosencasa.com'}
          quote={title}
          hashtags={['niñosencasa']}
        >
          <FacebookIcon size={32} round={true} />
        </FacebookShareButton>
        <TwitterShareButton
          className="sharing-button"
          url={'http://www.niñosencasa.com'}
          title={title}
          hashtags={['niñosencasa']}
        >
          <TwitterIcon size={32} round={true} />
        </TwitterShareButton>
        <WhatsappShareButton
          className="sharing-button"
          url={'http://www.niñosencasa.com'}
          title={title}
        >
          <WhatsappIcon size={32} round={true} />
        </WhatsappShareButton>
        <TelegramShareButton
          className="sharing-button"
          url={'http://www.niñosencasa.com'}
          title={title}
        >
          <TelegramIcon size={32} round={true} />
        </TelegramShareButton>
        <PinterestShareButton
          className="sharing-button"
          url={'http://www.niñosencasa.com'}
          media={'http://www.niñosencasa.com/shareimage.png'}
          description={title}
        >
          <PinterestIcon size={32} round={true} />
        </PinterestShareButton>
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