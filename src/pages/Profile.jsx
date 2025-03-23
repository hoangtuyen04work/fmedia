import "../styles/Home.scss"
import LeftBar from "../components/LeftBar";
import RightBar from "../components/RightBar";
import CenterProfile from "../components/CenterProfile";

function Home() {
  return (
    <div className="home">
      <LeftBar />
      <main className="home__main">
        <CenterProfile/>
      </main>
      <RightBar />
    </div>
  );
}

export default Home;