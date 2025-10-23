import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../global/Language.jsx';
import { useTips } from '../global/Tips.jsx';
import { submitForm } from '../helper/Form.jsx';
import { TipsBox } from '../units/TipsBox.jsx';
import TextBox from '../units/TextBox.jsx';
import '../style/Authn.css';

export function ForgotPassword() {
    // Global value
    const { transLang } = useLang();
    const { tipsMessage } = useTips();
    const navigate = useNavigate();

    // View
    return (
        <div className="page-content authn">
            <div className="widget">
                <div className="top-name">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="22" fill="#525896"/>
                        <path d="M16 32L24 14L32 32H28L24 24L20 32H16Z" fill="white"/>
                    </svg>
                    <h1>{transLang('panelName')}</h1>
                </div>
                
                <div className="form">
                    <form id="forgotPasswordForm" method="post" onSubmit={(e) => submitForm(e, transLang, function(responseData) {
                        if(responseData) {
                            navigate('/reset_password');
                        }
                    })}>
                        <TipsBox type={tipsMessage.type ?? ''} text={tipsMessage.text ?? ''} />

                        <div><h2>{transLang('forgotPwd')}</h2></div>

                        <div><TextBox name="action_index" value="forgotpwd" extra={{ type: 'hidden'}}/></div>

                        <div className="iweb-row">
                            <TextBox name="email" value="" extra={{ alias: transLang('forgotPwdTxt'), validation: 'required|email'}}/>
                        </div>

                        <div className="iweb-row" style={{ textAlign: 'right' }}>
                            <Link to="/"><u>{transLang('btnBack')}</u></Link>
                        </div>

                        <div className="iweb-row last">
                            <button type="submit" className="btn full">{transLang('btnSend')}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}