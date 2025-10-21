import { useState, useMemo } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLayout } from './global/Layout.jsx';
import { useAuthn } from './global/Authn.jsx';
import LeftMenu from './pages/LeftMenu.jsx';
import { Signin as SigninPage } from './pages/Signin.jsx';
import { Home as HomePage } from './pages/Home.jsx';
import { Profile as ProfilePage } from './pages/Profile.jsx';
import { ForgotPassword as ForgotPasswordPage } from './pages/ForgotPassword.jsx';
import { ResetPassword as ResetPasswordPage } from './pages/ResetPassword.jsx';

export default function App() {
    const {authnToken, authnInfo, authnLoading} = useAuthn();
    const {pageExpand, pagePath} = useLayout(false);
    const [menuVisible, setMenuVisible] = useState(false);

    // Protected
    const protectedPages = {
        home: HomePage,
        profile: ProfilePage
    };

    const protectedRoutes = useMemo(() => {
        const elements = {};
        Object.entries(protectedPages).forEach(([path, Component]) => {
            elements[path] = (
                <ProtectedRoute authnInfo={ authnInfo }>
                    <Component/>
                </ProtectedRoute>
            );
        });
        return elements;
    }, [authnInfo]);

    function ProtectedRoute({ children, authnInfo }) {
        if (!authnInfo) { return <Navigate to='/' replace />; }
        return children;
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
                            <Link onClick={ () => setMenuVisible(!menuVisible) }><FontAwesomeIcon icon='fa-indent' className='icon-white'/></Link>
                        </div>
                        <div className='welcome'>
                            <Link to='/profile'>Hi, <u>{ authnInfo ? authnInfo.display_name: 'Guest' }</u></Link>
                        </div>
                    </header>
                    <LeftMenu isVisible={menuVisible} setIsVisible={setMenuVisible}/>
                    <nav className='path'>
                        <div>
                            <ul>
                                {pagePath && (
                                    pagePath.map((item, index) => (
                                        <li key={ index }><FontAwesomeIcon icon="fa-angle-right" /><Link to={ item.url }>{ item.name }</Link></li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </nav>
                </>
                )}
                <main className={`page-body${!authnInfo ? ' full' : (pageExpand ? ' expand': '')}`}>
                    <Routes>
                        <Route path='/' element={ authnToken ? protectedRoutes.home : <SigninPage /> }  />

                        <Route path="/profile" element={ protectedRoutes.profile } />
                        <Route path="/about" element={ protectedRoutes.about } />
                        <Route path="/contact" element={ protectedRoutes.contact } />

                        <Route path='/forgot_password' element={ <ForgotPasswordPage /> } />
                        <Route path='/reset_password' element={ <ResetPasswordPage /> } /> 
                    </Routes>
                </main>
            </>
        );
    }
}