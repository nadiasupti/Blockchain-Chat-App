import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//internal import
import { ChatAppProvider } from "../Context/ChatAppContext";
import {NavBar} from "../Components/index";

const MyApp =({ Component, pageProps }) =>(
  <div>
    <ChatAppProvider> 
      <NavBar />
      <Component {...pageProps} />
      <ToastContainer position="top-right" autoClose={5000} />
      </ChatAppProvider>
  </div>
);

export default MyApp;
