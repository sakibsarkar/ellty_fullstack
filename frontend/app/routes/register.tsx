import RegisterView from "~/views/RegisterView";

export function meta() {
  return [
    { title: "Ellty task-1 | Register" },
    { name: "description", content: "Welcome to Ellty task-1" },
  ];
}

export default function Register() {
  return <RegisterView />;
}
