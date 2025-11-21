import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
  layout("./layouts/MainLayout.tsx", [route("", "routes/home.tsx")]),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
] satisfies RouteConfig;
