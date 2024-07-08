import { rest } from "msw";

const baseURL = "https://pp5-backend-d8f71e1af953.herokuapp.com/";

export const handlers = [
  rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
    return res(
      ctx.json({
        pk: 3,
        username: "Jenny",
        email: "",
        first_name: "",
        last_name: "",
        profile_id: 3,
        profile_image:
          "https://res.cloudinary.com/decyhmfum/image/upload/v1/media/../default_profile_bc7tpt",
      })
    );
  }),
  rest.get(`${baseURL}posts/`, (res) => {
    return res();
  }),
  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
