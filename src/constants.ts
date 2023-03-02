require("dotenv").config();

export const mongodbUrl = process.env.MONGODB_URL;

// FIXME: just for demo proposes, delete on production
console.log({
  mongodbUrl,
});
