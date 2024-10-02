import axios from "@/lib/api";

const Home = async () => {
  await pingServer();
  return <div>Home</div>;
};

export default Home;

const pingServer = async () => {
  await axios.get("/ping");
};
