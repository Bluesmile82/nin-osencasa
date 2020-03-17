import React, { useRef }  from 'react';
import { gql, useMutation } from '@apollo/client';

import { MultiSelect } from 'react-selectize';
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
    $author: String!
    $participants: String!
    $activity: String!
    $description: String!
    $duration: Number
  ) {
    addIdea(
      title: $title
      author: $author
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
    $title: String!
    $author: String!
    $participants: String!
    $activity: String!
    $description: String!
    $duration: Number
  ) {
    updateIdea(
      id: $id
      title: $title
      author: $author
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
  ({ defaultValue, label, textarea, selectOptions, multi }, ref) => {
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
              <option participants={s}>{s}</option>
            ))}
          </Select>
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
        />
      </Label>
    );
  }
);


const Form = ({ currentItem, refetch }) => {

  const { id } = currentItem;

  const nameRef = useRef(null);

  const titleRef = useRef(null);
  const authorRef = useRef(null);
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
          participants: participantsRef.current.value,
          author: authorRef.current.value,
          activity: activityRef.current.value,
          description: descriptionRef.current.value,
          duration: durationRef.current.value
        }
      })
    } else {
      await addIdea({
        variables: {
          title: titleRef.current.value,
          participants: participantsRef.current.value,
          author: authorRef.current.value,
          activity: activityRef.current.value,
          description: descriptionRef.current.value,
          duration: durationRef.current.value,
        }
      });
    }
    await refetch();
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
          label="title"
          ref={titleRef}
        />
        <FormLabel
          label="author"
          ref={authorRef}
          defaultValue={currentItem ? currentItem.author : undefined}
        />
        <FormLabel
          label="participants"
          ref={participantsRef}
          selectOptions={participantss}
          defaultValue={currentItem ? currentItem.participants : undefined}
        />
        <FormLabel
          label="activity"
          ref={activityRef}
          defaultValue={currentItem ? currentItem.activity : undefined}
        />
        <FormLabel
          label="description"
          ref={descriptionRef}
          textarea
          defaultValue={currentItem ? currentItem.description : undefined}
        />
        <FormLabel
          label="youtube id"
          ref={durationRef}
          defaultValue={currentItem ? currentItem.duration : undefined}
        />
      </>
    <Button sx={{ marginLeft: 1 }}>Submit</Button>
    </Flex>
  );
}

export default Form;
