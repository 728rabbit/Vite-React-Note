import { Link } from 'react-router-dom';
import { useLang } from '../global/Language.jsx';
import { useTips } from '../global/Tips.jsx';
import { useAuthn } from '../global/Authn.jsx';
import { submitForm } from '../helper/Form.jsx';
import { TipsBox } from '../units/TipsBox.jsx';
import TextBox from '../units/TextBox.jsx';
import SelectBox from '../units/SelectBox.jsx';
import '../style/Authn.css';

export function Signin() {
    // Global value
    const { transLang } = useLang();
    const { renewAuthnToken } = useAuthn();
    const { tipsMessage } = useTips();

    // View
    return (
        <div className='page-content authn'>
            <div className='widget'>
                <div className='top-name'>
                    <svg width='48' height='48' viewBox='0 0 48 48' fill='none'>
                        <circle cx='24' cy='24' r='22' fill='#525896'/>
                        <path d='M16 32L24 14L32 32H28L24 24L20 32H16Z' fill='white'/>
                    </svg>
                    <span>{transLang('panelName')}</span>
                </div>
                <div className='form'>
                    <form id='loginForm' method='post' onSubmit={(e) => submitForm(e, transLang, function(responseData) {
                        if(responseData) {
                            renewAuthnToken(responseData.access_token);
                        }
                    })}>
                        <TipsBox type={tipsMessage.type ?? ''} text={tipsMessage.text ?? ''} />

                        <div><TextBox name='action_index' value='login' extra={{ type: 'hidden'}}/></div>
                        <div className='iweb-row'>
                            <TextBox name='username' value='' extra={{ alias: transLang('userName'), validation: 'required'}}/>
                        </div>
                        <div className='iweb-row'>
                            <TextBox name='password' value='' extra={{ type: 'password', alias: transLang('password'), validation: 'required'}}/>
                        </div>
                        <div className='iweb-row'>
                            <table width='100%'>
                                <tbody>
                                    <tr>
                                        <td>
                                             <SelectBox name='remember_me' options={[{ value: '1', label: transLang('rememberMe') }]} extra={{ type: 'checkbox' }}/>
                                        </td>
                                        <td style={{ textAlign: 'right' }}><Link to='/forgot'><u>{transLang('forgotPwd')}</u></Link></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='iweb-row last'>
                            <button type='submit' className='btn full'>{transLang('loginNow')}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}