import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { useAuthn } from '../Authn.jsx';
import { useLang } from '../Language.jsx';
import { submitForm } from "../helper/Form.jsx";
import TxtBox from "../units/TxtBox";

export function Profile({ setPageExpand, setPagePath }) {
    // Global value
    const { transLang } = useLang();
    const { authnInfo, renewAuthnInfo, tipsMessage, renewTipsMessage } = useAuthn();

    let defaultFormValues = {
        display_name: authnInfo.display_name ?? '',
        email: authnInfo.email ?? '',
        password: '',
        repeat_password: '',
    };
    const [formValues, setFormValues] = useState(defaultFormValues);

    // Init
    useEffect(() => {
        setPageExpand(true);
        setPagePath([{ name: transLang('profile'), url: '/profile' }]);
    }, []);

    // View
    return (
        <>
            <form id="profileForm" name="profileForm" method="post" onSubmit={(e) => submitForm(e, transLang, function(responseData) {
                defaultFormValues = {
                    display_name: responseData.user.display_name ?? '',
                    email: responseData.user.email ?? '',
                    password: '',
                    repeat_password: '',
                };
                setFormValues(defaultFormValues);

                renewTipsMessage({ type: 'success', text: responseData.message });

                renewAuthnInfo(responseData.user);
            }, function() {
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
                <div className={`page-message iweb-tips-message ${tipsMessage?.type || ''}`}>
                {tipsMessage?.text && (
                    <div>
                        <span>{tipsMessage.text}</span>
                        <a href="#" onClick={() => renewTipsMessage(null)} className="close">×</a>
                    </div>
                )}
                </div>

                <div className="widget thin top fixed">
                    <div className="controls">
                        <button type="button" className="btn btn-red" onClick={() => {
                            setFormValues(defaultFormValues);
                        }}>
                            <FontAwesomeIcon icon="fa-undo"/><span>{transLang('btnReset')}</span>
                        </button>
                        <button type="submit" className="btn btn-green">
                            <FontAwesomeIcon icon="fa-save"/><span>{transLang('btnSave')}</span>
                        </button>
                    </div>
                    <div className="clearboth"></div>
                </div>

                <div><TxtBox name="action_index" value="update_profile" extra={{ type: 'hidden'}}/></div>

                <div className="widget">
                    <div className="iweb-row">
                        <div className="iweb-grid">
                            <div className="column-2">
                                <TxtBox name="display_name" value={formValues.display_name} 
                                onChange={val => setFormValues(prev => ({ ...prev, display_name: val }))}
                                extra={{ alias: transLang('displayName'), validation: 'required'}}/>
                            </div>
                            <div className="column-2">
                                <TxtBox name="email" value={formValues.email} 
                                onChange={val => setFormValues(prev => ({ ...prev, email: val }))}
                                extra={{ alias: transLang('email'), validation: 'email'}}/>
                            </div>
                        </div>
                    </div>
                    <div className="iweb-row">
                        <div className="iweb-grid">
                            <div className="column-2">
                                <TxtBox name="password" value={formValues.password} 
                                onChange={val => setFormValues(prev => ({ ...prev, password: val }))}
                                extra={{ type: 'password', alias: transLang('password'), validation: 'password'}}/>
                            </div>
                            <div className="column-2">
                                <TxtBox name="repeat_password" value={formValues.repeat_password} 
                                onChange={val => setFormValues(prev => ({ ...prev, repeat_password: val }))}
                                extra={{ type: 'password', alias: transLang('repeatPassword'), validation: 'password'}}/>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </form>
        </>
    );

}