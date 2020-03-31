import React, { useRef, useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import { MultiSelect } from 'react-selectize';
import InputRange from 'react-input-range';
import StarRatingComponent from 'react-star-rating-component';

import '../../../../node_modules/react-input-range/lib/css/index.css';
import '../../../../node_modules/react-selectize/themes/index.css';
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
    $participantsMin: Int
    $participantsMax: Int
    $ageMin: Int
    $ageMax: Int
    $activity: String
    $description: String
    $duration: Int
  ) {
    addIdea(
      title: $title
      participantsMin: $participantsMin
      participantsMax: $participantsMax
      ageMin: $ageMin
      ageMax: $ageMax
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
    $participantsMin: Int
    $participantsMax: Int
    $ageMin: Int
    $ageMax: Int
    $activity: String
    $description: String
    $duration: Int
  ) {
    updateIdea(
      id: $id
      title: $title
      participantsMin: $participantsMin
      participantsMax: $participantsMax
      ageMin: $ageMin
      ageMax: $ageMax
      activity: $activity
      description: $description
      duration: $duration
    ) {
      id
    }
  }
`;

const FormLabel = React.forwardRef(
  ({ defaultValue, label, type, textarea, selectOptions, multi, ...props }, ref) => {
    const [starValue, setStarValue] = useState(defaultValue);
    const [sliderValue, setSliderValue] = useState(
      defaultValue || { min: props.min, max: props.max }
    );

    if (type === 'range') {
      return (
        <>
          <Label
            sx={{
              display: 'flex',
              marginBottom: 3,
              justifyContent: 'space-between'
            }}
          >
            <span style={{ marginRight: '20px' }}>{label}</span>
            <InputRange
              ref={ref}
              maxValue={props.max}
              name={label}
              minValue={props.min}
              value={sliderValue || { min: props.min, max: props.max }}
              onChange={e => setSliderValue(e)}
              allowSameValues
            />
          </Label>
        </>
      );
    }

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
              style={{ width: '100%' }}
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
            renderStarIcon={() => <span>⧗</span>}
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
  const ageRef = useRef(null);
  const activityRef = useRef(null);
  const descriptionRef = useRef(null);
  const durationRef = useRef(null);

  const [addIdea] = useMutation(ADD_IDEA);
  const [updateIdea] = useMutation(UPDATE_IDEA);

  const onSubmit = async (e, id) => {
    e.preventDefault();
    const variables = {
      title: titleRef.current.value,
      participantsMin: participantsRef.current.props.value?.min || null,
      participantsMax: participantsRef.current.props.value?.max || null,
      ageMin: ageRef.current.props.value?.min || null,
      ageMax: ageRef.current.props.value?.max || null,
      activity: activityRef.current.value,
      description: descriptionRef.current.value,
      duration: durationRef.current.state.value || null
    };
    if (id) {
      await updateIdea({ variables: { ...variables, id } });
    } else {
      await addIdea({ variables });
    }
    if (refetch) {
      await refetch();
    }
    if (onSend) {
      onSend();
    }
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
          min={1}
          max={8}
          defaultValue={(currentItem ? { min: currentItem.participantsMin, max: currentItem.participantsMax } : { min: 1, max: 8 })}
          type="range"
        />
        <FormLabel
          label="Edad"
          ref={ageRef}
          min={1}
          max={16}
          defaultValue={(currentItem ? { min: currentItem.ageMin, max: currentItem.ageMax } : { min: 1, max: 16 })}
          type="range"
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
