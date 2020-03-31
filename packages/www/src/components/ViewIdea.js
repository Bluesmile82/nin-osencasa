import React from 'react';
import { Box } from 'theme-ui';
import StarRatingComponent from 'react-star-rating-component';
import '../../styles/index.scss';

const parseLinks = text => {
  return text.replace(
    /(http.*)\s?/g,
    t => `<a href="${t}" target="_blank">${t}</a></br>`
  );
};

const ViewIdea = ({ idea, className }) => (
  <Box p={3} key={idea.title} className={className}>
    <h3>{idea.title}</h3>
    <div
      dangerouslySetInnerHTML={{
        __html: parseLinks(idea.description)
      }}
    />
    <div>
      {idea.participantsMin}{' '}
      {idea.participantsMax && idea.participantsMin !== idea.participantsMax
        ? `a ${idea.participantsMax} `
        : ' '}
      participantes
    </div>
    <div>
      {' '}
      Para {idea.ageMin}{' '}
      {idea.ageMax && idea.ageMin !== idea.ageMax ? `a ${idea.ageMax} ` : ' '}
      años
    </div>
    {idea.duration && (
      <div>
        Duración:
        <StarRatingComponent
          className="stars"
          name={'index-duration'}
          value={idea.duration}
          renderStarIcon={() => <span>⧗</span>}
          editing={false}
        />
      </div>
    )}
  </Box>
);

export default ViewIdea;