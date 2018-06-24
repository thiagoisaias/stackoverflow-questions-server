const axios = require("axios");
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
    tags: String
    title: String
    url: String
    user: User
  }

  type Query {
    getQuestions(
      limit: Int
      score: Int
      sort: String
      tags: String!
    ): [Question]
  }
`;

exports.resolvers = {
  Query: {
    getQuestions(root, args) {
      return axios
        .get(
          `https://api.stackexchange.com/2.2/questions?&site=stackoverflow&pagesize=${args.limit ||
            10}&order=desc&score=${args.score || 100}&sort=${args.sort ||
            "votes"}&tagged=javascript;${args.tags}`
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
