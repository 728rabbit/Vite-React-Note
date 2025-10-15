import '../style/Authn.css';
import TxtBox from "../units/TxtBox";
import SelectBox from "../units/SelectBox";
import { useLang } from "../Language";
import { Link } from "react-router-dom";
import { submitForm } from "../helper/Form.jsx";
import { useAuthn } from '../Authn.jsx';

export function Login() {
    const { transLang } = useLang();
    const { renewAuthnToken } = useAuthn();

    return (
        <div className="page-content authn">
            <div className="widget">
                <div className="top-name">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="22" fill="#525896"/>
                        <path d="M16 32L24 14L32 32H28L24 24L20 32H16Z" fill="white"/>
                    </svg>
                    <span>{transLang('panelName')}</span>
                </div>
                <div className="form">
                    <form id="loginForm" method="post" onSubmit={(e) => submitForm(e, transLang, function(responseData) {
                        if(responseData) {
                            console.log(responseData);
                            renewAuthnToken('Abc');
                        }
                    })}>
                        <div className="page-message iweb-tips-message"></div>
                        <div className="iweb-row">
                            <TxtBox name="username" value="" extra={{ alias: transLang('userName'), validation: 'required'}}/>
                        </div>
                        <div className="iweb-row">
                            <TxtBox name="password" value="" extra={{ type: 'password', alias: transLang('password'), validation: 'required'}}/>
                        </div>
                        <div className="iweb-row">
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <td>
                                             <SelectBox name="remember_me" options={[{ value: '1', label: transLang('rememberMe') }]} extra={{ type: 'checkbox' }}/>
                                        </td>
                                        <td style={{ textAlign: 'right' }}><Link to="/forgot"><u>{transLang('forgotPwd')}</u></Link></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="iweb-row last">
                            <button type="submit" className="btn full">{transLang('loginNow')}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}