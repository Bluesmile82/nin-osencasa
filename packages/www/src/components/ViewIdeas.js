

import React, { useState } from 'react';
import { Flex, Input, Label } from 'theme-ui';
import InputRange from 'react-input-range';
import '../../styles/index.scss';
import ViewIdea from './ViewIdea'

const ViewIdeas = ({ data, loading, error }) => {
  const [search, setSearch] = useState('');
  const [ageValue, setAgeValue] = useState({ min: 1, max: 16 });
  const [participantsValue, setParticipantsValue] = useState({
    min: 1,
    max: 8
  });
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
        idea =>
          ageValue.max <= idea.ageMax ||
          (ageValue.min <= idea.ageMax && ageValue.max >= idea.ageMin)
      )
      .filter(
        idea =>
          participantsValue.max <= idea.participantsMax ||
          (participantsValue.min <= idea.participantsMax && participantsValue.max >= idea.participantsMin)
      )
      .filter(idea => idea.reviewed);

  return (
    <Flex sx={{ flexDirection: 'column' }}>
      {loading && <div>Cargando...</div>}
      {error && console.error(error) && <div>Error: Por favor recarga la página</div>}
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
            <span style={{ marginRight: '20px' }}>Edad</span>
            <InputRange
              maxValue={16}
              minValue={1}
              name={'age-filter'}
              value={ageValue}
              onChange={e => setAgeValue(e)}
              allowSameValues
            />
          </Label>
          <Label
            sx={{
              display: 'flex',
              marginBottom: 3,
              paddingRight: 2,
              justifyContent: 'space-between'
            }}
          >
            <span style={{ marginRight: '20px' }}>Participantes</span>
            <InputRange
              maxValue={8}
              minValue={1}
              name={'participants-filter'}
              value={participantsValue}
              onChange={e => setParticipantsValue(e)}
              allowSameValues
            />
          </Label>
          <div>{filteredIdeas.length} ideas</div>
          <ol>
            {filteredIdeas.map(
              idea =>
                (
                  <li>
                    <ViewIdea key={idea.title} idea={idea}/>
                  </li>
                )
            )}
          </ol>
        </>
      )}
    </Flex>
  );
};

export default ViewIdeas;