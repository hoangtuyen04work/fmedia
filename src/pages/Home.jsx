import "../styles/Home.scss"
import LeftBar from "../components/LeftBar";
import RightBar from "../components/RightBar";
import CenterContent from "../components/CenterContent";

function Home() {
  return (
    <div className="home">
      <LeftBar />
      <main className="home__main">
        <CenterContent/>
      </main>
      <RightBar />
    </div>
  );
}

export default Home;