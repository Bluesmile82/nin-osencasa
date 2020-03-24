const { ApolloServer, gql } = require('apollo-server-lambda');
const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNA });

const typeDefs = gql`
  type Query {
    ideas: [Idea]
  }
  type Idea {
    id: ID!
    title: String!
    participantsMin: Int
    participantsMax: Int
    ageMin: Int
    ageMax: Int
    activity: String
    description: String
    duration: Int
    reviewed: Boolean
  }
  type Mutation {
    addIdea(
      title: String!
      participantsMin: Int
      participantsMax: Int
      ageMin: Int
      ageMax: Int
      activity: String
      description: String
      duration: Int
      reviewed: Boolean
    ): Idea
    deleteIdea(id: ID!): Idea
    updateIdea(
      id: ID!
      title: String
      participantsMin: Int
      participantsMax: Int
      ageMin: Int
      ageMax: Int
      activity: String
      description: String
      duration: Int
    ): Idea
    reviewIdea(id: ID!): Idea
  }
`;

const resolvers = {
  Query: {
    ideas: async () => {
      const results = await client.query(
        q.Paginate(q.Match(q.Index('ideas')), { size: 30000 })
      );
      if (!results) return [];
      return results.data.map(d => {
        const [
          ref,
          title,
          participantsMin,
          participantsMax,
          ageMin,
          ageMax,
          activity,
          description,
          duration,
          reviewed
        ] = d;
        return {
          id: ref.id,
          title,
          participantsMin,
          participantsMax,
          ageMin,
          ageMax,
          activity,
          description,
          duration,
          reviewed
        };
      });
    }
  },
  Mutation: {
    addIdea: async (
      _,
      {
        title,
        participantsMin,
        participantsMax,
        ageMin,
        ageMax,
        activity,
        description,
        duration
      }
    ) => {
      const results = await client.query(
        q.Create(q.Collection('ideas'), {
          data: {
            title,
            participantsMin,
            participantsMax,
            ageMin,
            ageMax,
            activity,
            description,
            duration,
            reviewed: false
          }
        })
      );
      return {
        ...results.data,
        id: results.ref.id
      };
    },
    deleteIdea: async (_, { id }) => {
      const results = await client.query(
        q.Delete(q.Ref(q.Collection('ideas'), id))
      );
      return {
        id: results.ref.id
      };
    },
    updateIdea: async (
      _,
      {
        id,
        title,
        participantsMin,
        participantsMax,
        ageMin,
        ageMax,
        activity,
        description,
        duration
      }
    ) => {
      const results = await client.query(
        q.Update(q.Ref(q.Collection('ideas'), id), {
          data: {
            title,
            participantsMin,
            participantsMax,
            ageMin,
            ageMax,
            activity,
            description,
            duration
          }
        })
      );
      return {
        ...results.data,
        id: results.ref.id
      };
    },
    reviewIdea: async (_, { id }) => {
      const results = await client.query(
        q.Update(q.Ref(q.Collection('ideas'), id), {
          data: {
            reviewed: true
          }
        })
      );
      console.log('re', results);
      return {
        ...results.data,
        id: results.ref.id
      };
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
});

exports.typeDefs = typeDefs;
exports.resolvers = resolvers;

exports.handler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true
  }
});