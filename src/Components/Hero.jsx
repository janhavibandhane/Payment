import { Link } from "react-router-dom";
import Payment from "./Payment";

function Hero() {
  return (
    <>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Pay Here</h1>
            <p className="mb-5">
             Pay here to Janhavi Bandhane 
            </p>
           <div className=" flex flex-col space-y-3">

              <Link to={"/signin"}><button className="btn btn-primary">Sign In</button></Link>
              <Link to={"/Login"}><button className="btn btn-primary">Login</button></Link>
              
           </div>
          </div>
        </div>
      </div>
      
    </>
  );
}
export default Hero;