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
    author: String
    participants: String
    activity: String
    description: String
    duration: Int
  }
  type Mutation {
    addIdea(
      title: String!
      author: String
      participants: String
      activity: String
      description: String
      duration: Int
    ): Idea
    deleteIdea(id: ID!): Idea
    updateIdea(
      id: ID!
      title: String
      author: String
      participants: String
      activity: String
      description: String
      duration: Int
    ): Idea
  }
`;

const resolvers = {
  Query: {
    ideas: async () => {
      const results = await client.query(q.Paginate(q.Match(q.Index('ideas'))));
      if (!results) return [];
      return results.data.map(d => {
        const [
          ref,
          title,
          author,
          participants,
          activity,
          description,
          duration
        ] = d;
        return {
          id: ref.id,
          title,
          author,
          participants,
          activity,
          description,
          duration
        };
      });
    }
  },
  Mutation: {
    addIdea: async (
      _,
      { title, author, participants, activity, description, duration }
    ) => {
      const results = await client.query(
        q.Create(q.Collection('ideas'), {
          data: {
            title,
            author,
            participants,
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
      { id, title, author, participants, activity, description, duration }
    ) => {
      const results = await client.query(
        q.Update(q.Ref(q.Collection('ideas'), id), {
          data: {
            title,
            author,
            participants,
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