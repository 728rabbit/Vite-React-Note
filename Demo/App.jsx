import { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import favIcon from './assets/fav.png';
import LeftMenu from "./leftMenu.jsx";
import TxtBox from "./units/TxtBox.jsx";
import SelectBox from "./units/SelectBox.jsx"; 
import { validateForm, revisedFormData} from "./helper/Form.jsx";
import { useLang } from "./Language.jsx";
import { useAuthn } from "./Authn.jsx";
import { Login } from "./pages/Login.jsx";

export default function App() {
    const [menuVisible, setMenuVisible] = useState(false);
    const { authnInfo, authnLoading } = useAuthn();

    function Home() {
        return (
          <>
            <h1>首頁</h1>
          </>
        );
    }

    function About() {
        return <h1>關於我們</h1>;
    }

    function Contact() {
        return <h1>聯絡我們</h1>;
    }

    function ForgotPwd() {
        return <h1>忘記密碼</h1>;
    }

    function ResetPwd() {
        return <h1>重設密碼</h1>;
    }

    function ProtectedRoute({ children, authnInfo }) {
        if (!authnInfo) { return <Navigate to="/" replace />; }
        return children;
    }

    if(authnLoading) { 
        return (
            <>
                <div className="page-loading">
                    <div className="spinner"></div>
                    <div className="tips">Loading, please wait...</div>
                </div>
            </>
        ); 
    }
    else {
        return (
            <>
                {authnInfo && (
                <>
                    <header className="page-header">
                        <div className="logo">
                            <Link to="#">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                    <circle cx="24" cy="24" r="22" fill="#525896"/>
                                    <path d="M16 32L24 14L32 32H28L24 24L20 32H16Z" fill="white"/>
                                </svg>
                                <span>AdminHub<br/><small>系統管理中心</small></span>
                            </Link>
                        </div>
                        <div className="open">
                            <Link onClick={() => setMenuVisible(!menuVisible)}><FontAwesomeIcon icon="fa-indent" className="icon-white"/></Link>
                        </div>
                        <div className="welcome">
                            <Link to="/about">Hi, <u>{ authnInfo ? authnInfo.display_name: 'Guest'}</u></Link>
                        </div>
                    </header>
                    <LeftMenu isVisible={menuVisible} setIsVisible={setMenuVisible}/>
                    <nav className="path">
                        <div>
                            <ul>
                            <li><Link to="#">網站頁面</Link></li>
                            </ul>
                        </div>
                    </nav>
                </>
                )}
                <main className={`page-body${!authnInfo ? ' full' : ''}`}>
                    <Routes>
                        <Route path="/" element={authnInfo ? <Home /> : <Login />}  />
                        <Route path="/about" element={<ProtectedRoute authnInfo={authnInfo}><About /></ProtectedRoute>} />
                        <Route path="/contact" element={<ProtectedRoute authnInfo={authnInfo}><Contact /></ProtectedRoute>} />
        
                        <Route path="/forgot" element={<ForgotPwd />} />
                        <Route path="/reset" element={<ResetPwd />} />
                    </Routes>
                </main>
            </>
        );
    }
}