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
    key: String
    style: String
    lyrics: String
    youtubeId: String
  }
  type Mutation {
    addIdea(
      title: String!,
      key: String,
      style: String,
      lyrics: String,
      youtubeId: String
    ): Idea
    updateIdea(
      id: ID!,
      title: String!,
      key: String,
      style: String,
      lyrics: String,
      youtubeId: String
    ): Idea
  }
`;

const resolvers = {
  Query: {
    ideas: async (parent, args, { user }) => {

      if (!user) {
        throw new Error('Must be authenticated to see the ideas');
      } else {
        const results = await client.query(
          q.Paginate(q.Match(q.Index('ideas_by_user'), user))
        );
        return results.data.map(([ref, title, youtubeId]) => ({
          id: ref.id,
          title,
          youtubeId
        }));
      }
    }
  },
  Mutation: {
    addIdea: async (
      _,
      { title, key, style, lyrics, youtubeId },
      { user }
    ) => {
      if (!user) {
        throw new Error('Must be authenticated to create a idea');
      }
      const results = await client.query(
        q.Create(q.Collection('ideas'), {
          data: {
            title,
            key,
            style,
            lyrics,
            youtubeId,
            owner: user
          }
        })
      );
      return {
        ...results.data,
        id: results.ref.id
      };
    },
    updateIdea: async (
      _,
      { id, title, key, style, lyrics, youtubeId },
      { user }
    ) => {
      if (!user) {
        throw new Error('Must be authenticated to update a idea');
      }
      const results = await client.query(
        q.Update(q.Ref(q.Collection('ideas'), id), {
          data: {
            title,
            key,
            style,
            lyrics,
            youtubeId
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
  context: ({ context }) => {
    if (context && context.clientContext.user) {
      return { user: context.clientContext.user };
    } else {
      return {};
    }
  },
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