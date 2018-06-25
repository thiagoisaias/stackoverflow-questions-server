const { axios } = require("./axios");
const { gql } = require("apollo-server-express");

exports.typeDefs = gql`
  type User {
    id: Int
    name: String
    profileImage: String
  }

  type Question {
    id: Int
    createdAt: String
    numberOfAnswers: Int
    score: Int
    tags: [String]
    title: String
    url: String
    user: User
  }

  type Query {
    getQuestions(
      limit: String
      score: String
      sort: String
      tags: String!
    ): [Question]
  }
`;

exports.resolvers = {
  Query: {
    getQuestions(root, args) {
      const minTerm = `&min=${args.score || 5}`;
      const sortTerm = `&sort=${args.sort || "votes"}`;
      const orderTerm = `&order=asc`;
      const tagTerm = `&tagged=javascript;${args.tags}`;
      const limitTerm = `&pagesize=${args.limit || 10}`;

      return axios
        .get(
          `/questions?&site=stackoverflow${minTerm}${tagTerm}${limitTerm}${sortTerm}${orderTerm}`
        )
        .then(response => {
          return response.data.items.map(question => {
            return {
              id: question.question_id,
              createdAt: question.creation_date,
              numberOfAnswers: question.answer_count,
              user: {
                id: question.owner.user_id,
                name: question.owner.display_name,
                profileImage: question.owner.profile_image
              },
              score: question.score,
              tags: question.tags,
              title: question.title,
              url: question.link
            };
          });
        });
    }
  }
};
