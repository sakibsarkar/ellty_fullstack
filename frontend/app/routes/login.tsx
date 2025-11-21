import LoginView from "~/views/LoginView";

export function meta() {
  return [
    { title: "Ellty task-1 | Login" },
    { name: "description", content: "Welcome to Ellty task-1" },
  ];
}

export default function Login() {
  return <LoginView />;
}
