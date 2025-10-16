import { useState, useMemo, useCallback } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import favIcon from './assets/fav.png';
import LeftMenu from './leftMenu.jsx';
import TxtBox from './units/TxtBox.jsx';
import SelectBox from './units/SelectBox.jsx'; 
import { validateForm, revisedFormData} from './helper/Form.jsx';
import { useLang } from './Language.jsx';
import { useAuthn } from './Authn.jsx';
import { Login } from './pages/Login.jsx';
import { Profile } from './pages/Profile.jsx'

export default function App() {
    const { authnInfo, authnLoading } = useAuthn();
    const [menuVisible, setMenuVisible] = useState(false);
    const [pageExpand, setPageExpand] = useState(false);
    const [pagePath, setPagePath] = useState([]);

    // Protected
    const protectedPages = {
        profile: Profile,
        about: About,
        contact: Contact,
    };

    const protectedRoutes = useMemo(() => {
        const elements = {};
        Object.entries(protectedPages).forEach(([path, Component]) => {
            elements[path] = (
                <ProtectedRoute authnInfo={authnInfo}>
                    <Component setPageExpand={setPageExpand} setPagePath={setPagePath}/>
                </ProtectedRoute>
            );
        });
        return elements;
    }, [authnInfo, setPageExpand, setPagePath]);

    function ProtectedRoute({ children, authnInfo }) {
        if (!authnInfo) { return <Navigate to='/' replace />; }
        return children;
    }


    
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

    
    

    if(authnLoading) { 
        return (
            <>
                <div className='page-loading'>
                    <div className='spinner'></div>
                    <div className='tips'>Loading, please wait...</div>
                </div>
            </>
        ); 
    }
    else {
        return (
            <>
                {authnInfo && (
                <>
                    <header className='page-header'>
                        <div className='logo'>
                            <Link to='#'>
                                <svg width='48' height='48' viewBox='0 0 48 48' fill='none'>
                                    <circle cx='24' cy='24' r='22' fill='#525896'/>
                                    <path d='M16 32L24 14L32 32H28L24 24L20 32H16Z' fill='white'/>
                                </svg>
                                <span>AdminHub<br/><small>系統管理中心</small></span>
                            </Link>
                        </div>
                        <div className='open'>
                            <Link onClick={() => setMenuVisible(!menuVisible)}><FontAwesomeIcon icon='fa-indent' className='icon-white'/></Link>
                        </div>
                        <div className='welcome'>
                            <Link to='/profile'>Hi, <u>{ authnInfo ? authnInfo.display_name: 'Guest'}</u></Link>
                        </div>
                    </header>
                    <LeftMenu isVisible={menuVisible} setIsVisible={setMenuVisible}/>
                    <nav className='path'>
                        <div>
                            <ul>
                                <li><Link to='/'>主頁</Link></li>
                                {pagePath && (
                                    pagePath.map((item, index) => (
                                        <li key={index}><FontAwesomeIcon icon="fa-angle-right" /><Link to={item.url}>{item.name}</Link></li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </nav>
                </>
                )}
                <main className={`page-body${!authnInfo ? ' full' : (pageExpand ? ' expand': '')}`}>
                    <Routes>
                        <Route path='/' element={authnInfo ? <Home /> : <Login />}  />

                        <Route path="/profile" element={protectedRoutes.profile} />
                        <Route path="/about" element={protectedRoutes.about} />
                        <Route path="/contact" element={protectedRoutes.contact} />

                        <Route path='/forgot' element={<ForgotPwd />} />
                        <Route path='/reset' element={<ResetPwd />} />
                       
                    </Routes>
                </main>
            </>
        );
    }
}