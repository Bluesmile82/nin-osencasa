import React, { useRef, useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import { MultiSelect } from 'react-selectize';
import '../../../../node_modules/react-selectize/themes/index.css';
import StarRatingComponent from 'react-star-rating-component';

import {
  Button,
  Flex,
  Input,
  Textarea,
  Label,
  Select
} from 'theme-ui';

const ADD_IDEA = gql`
  mutation AddIdea(
    $title: String!
    $participants: String
    $activity: String
    $description: String
    $duration: Int
  ) {
    addIdea(
      title: $title
      participants: $participants
      activity: $activity
      description: $description
      duration: $duration
    ) {
      id
    }
  }
`;

const UPDATE_IDEA = gql`
  mutation UpdateIdea(
    $id: ID!
    $title: String
    $participants: String
    $activity: String
    $description: String
    $duration: Int
  ) {
    updateIdea(
      id: $id
      title: $title
      participants: $participants
      activity: $activity
      description: $description
      duration: $duration
    ) {
      id
    }
  }
`;

const FormLabel = React.forwardRef(
  ({ defaultValue, label, type, textarea, selectOptions, multi }, ref) => {
    const [starValue, setStarValue] = useState(defaultValue);
    if (selectOptions) {
      if (multi) {
        return (
          <Label
            sx={{
              display: 'flex',
              marginBottom: 3,
              justifyContent: 'space-between'
            }}
          >
            <span>{label}</span>
            <MultiSelect
              ref={ref}
              options={selectOptions.map(o => ({ value: o.id, label: o.name }))}
              defaultValues={defaultValue || undefined}
            />
          </Label>
        );
      }
      return (
        <Label
          sx={{
            display: 'flex',
            marginBottom: 3,
            justifyContent: 'space-between'
          }}
        >
          <span>{label}</span>
          <Select
            ref={ref}
            name={label}
            sx={{
              minWidth: '60px'
            }}
            defaultValue={defaultValue}
          >
            {selectOptions.map(s => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </Label>
      );
    }
    if (type === 'rating') {
      return (
        <Label
          sx={{
            display: 'flex',
            marginBottom: 3,
            justifyContent: 'space-between'
          }}
        >
          <span>{label}</span>
          <StarRatingComponent
            name={`form-${label}`}
            ref={ref}
            value={starValue || defaultValue}
            editing
            onStarClick={e => setStarValue(e)}
          />
        </Label>
      );
    }
    const InputComponent = textarea ? Textarea : Input;
    return (
      <Label
        sx={{
          display: 'flex',
          marginBottom: 3,
          justifyContent: 'space-between'
        }}
      >
        <span>{label}</span>
        <InputComponent
          ref={ref}
          sx={{ marginLeft: 3 }}
          name={label}
          defaultValue={defaultValue}
          type={type}
        />
      </Label>
    );
  }
);


const Form = ({ currentItem, refetch, onSend }) => {
  const { id } = currentItem || {};

  const titleRef = useRef(null);
  const participantsRef = useRef(null);
  const activityRef = useRef(null);
  const descriptionRef = useRef(null);
  const durationRef = useRef(null);

  const [addIdea] = useMutation(ADD_IDEA);
  const [updateIdea] = useMutation(UPDATE_IDEA);

  const onSubmit = async (e, id) => {
    e.preventDefault();
    if (id) {
      await updateIdea({
        variables: {
          id,
          title: titleRef.current.value,
          participants: participantsRef.current.value || null,
          activity: activityRef.current.value,
          description: descriptionRef.current.value,
          duration: durationRef.current.state.value || null
        }
      });
    } else {
      await addIdea({
        variables: {
          title: titleRef.current.value,
          participants: participantsRef.current.value || null,
          activity: activityRef.current.value,
          description: descriptionRef.current.value,
          duration: durationRef.current.state.value || null
        }
      });
    }
    if (refetch) {
      await refetch();
    }
    onSend();
  };
  return (
    <Flex
      as="form"
      onSubmit={e => onSubmit(e, id)}
      sx={{ flexDirection: 'column' }}
    >
      <>
        <FormLabel
          defaultValue={currentItem ? currentItem.title : undefined}
          label="Titulo"
          ref={titleRef}
        />
        <FormLabel
          label="Descripción"
          ref={descriptionRef}
          textarea
          defaultValue={currentItem ? currentItem.description : undefined}
        />
        <FormLabel
          label="Participantes"
          ref={participantsRef}
          selectOptions={['1', '1-2', '2', '2+', '2-4', '4+']}
          defaultValue={currentItem ? currentItem.participants : undefined}
          type="number"
        />
        <FormLabel
          label="Tipo de actividad"
          ref={activityRef}
          selectOptions={[
            'Juego',
            'Cocina',
            'Manualidad',
            'Educativa',
            'Otros'
          ]}
          defaultValue={currentItem ? currentItem.activity : undefined}
        />
        <FormLabel
          label="Duración"
          ref={durationRef}
          defaultValue={currentItem ? currentItem.duration : undefined}
          type="rating"
        />
      </>
      <Button sx={{ marginLeft: 1 }}>Enviar</Button>
    </Flex>
  );
};

export default Form;
