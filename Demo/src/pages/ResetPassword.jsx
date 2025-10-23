import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../global/Language.jsx';
import { useTips } from '../global/Tips.jsx';
import { submitForm } from '../helper/Form.jsx';
import { TipsBox } from '../units/TipsBox.jsx';
import TextBox from '../units/TextBox.jsx';
import '../style/Authn.css';

export function ResetPassword() {
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
                    <form id="resetPasswordForm" method="post" onSubmit={(e) => submitForm(e, transLang, function(responseData) {
                        if(responseData) {
                            alert(transLang('resetPwdOK'));
                            navigate('/');
                        }
                    }, 
                    function() {
                        const password = document.querySelector('input[name="password"]');
                        const repeat_password = document.querySelector('input[name="repeat_password"]');
                        if(password.value !== repeat_password.value) {
                            const errorDiv1 = document.createElement('small');
                            errorDiv1.className = 'tips';
                            errorDiv1.textContent = transLang('passwordNotMath');

                            const errorDiv2 = document.createElement('small');
                            errorDiv2.className = 'tips';
                            errorDiv2.textContent = transLang('passwordNotMath');

                            password.closest('div.iweb-input').classList.add('error');
                            repeat_password.closest('div.iweb-input').classList.add('error');

                            password.closest('div.iweb-input').appendChild(errorDiv1);
                            repeat_password.closest('div.iweb-input').appendChild(errorDiv2);
                            return false;
                        }
                        return true;
                    })}>
                        <TipsBox type={tipsMessage.type ?? ''} text={tipsMessage.text ?? ''} />

                        <div><h2>{ transLang('resetPwd') }</h2></div>

                        <div><TextBox name="action_index" value="resetpwd" extra={{ type: 'hidden'}}/></div>

                        <div className="iweb-row">
                            <TextBox name="token" value="" extra={{ alias: 'Token', validation: 'required'}}/>
                        </div>

                        <div className="iweb-row">
                            <TextBox name="password" value="" extra={{ type: 'password', alias: transLang('password'), validation: 'required|password'}}/>
                        </div>

                        <div className="iweb-row">
                            <TextBox name="repeat_password" value="" extra={{ type: 'password', alias: transLang('repeatPassword'), validation: 'required|password'}}/>
                        </div>

                        <div className="iweb-row" style={{ textAlign: 'right' }}>
                            <Link to="/"><u>{transLang('btnBack')}</u></Link>
                        </div>

                        <div className="iweb-row last">
                            <button type="submit" className="btn full">{ transLang('btnSubmit') }</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}