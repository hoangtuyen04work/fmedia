import "../styles/Home.scss"
import LeftBar from "../components/LeftBar";
import RightBar from "../components/RightBar";
import CenterSearch from "../components/CenterSearch";

function Home() {
  return (
    <div className="home">
      <LeftBar />
      <main className="home__main">
        <CenterSearch/>
      </main>
      <RightBar />
    </div>
  );
}

export default Home;