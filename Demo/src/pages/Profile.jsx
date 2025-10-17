import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useMemo } from 'react';
import { useLayout } from '../global/Layout.jsx';
import { useLang } from '../global/Language.jsx';
import { useTips } from '../global/Tips.jsx';
import { useAuthn } from '../global/Authn.jsx';
import { submitForm } from "../helper/Form.jsx";
import { TipsBox } from '../units/TipsBox.jsx';
import TextBox from "../units/TextBox";

export function Profile() {
    // Global value
    const { setPageExpand, setPagePath } = useLayout();
    const { transLang } = useLang();
    const { tipsMessage, setTipsMessage } = useTips();
    const { authnInfo, renewAuthnInfo } = useAuthn();

    let defaultFormValues = useMemo(() => ({
        username: authnInfo.username ?? '',
        display_name: authnInfo.display_name ?? '',
        telephone: authnInfo.telephone ?? '',
        email: authnInfo.email ?? '',
        password: '',
        repeat_password: '',
    }), [authnInfo]);
    const [formValues, setFormValues] = useState(defaultFormValues);

    // Init
    useEffect(() => {
        setPageExpand(true);
        setPagePath([{ name: transLang('profile'), url: '/profile'}]);
    }, []);

    // View
    return (
        <>
            <form id="profileForm" name="profileForm" method="post" onSubmit={(e) => submitForm(e, transLang, function(responseData) {
                defaultFormValues = {
                    username: responseData.user.username ?? '',
                    display_name: responseData.user.display_name ?? '',
                    telephone: responseData.user.telephone ?? '',
                    email: responseData.user.email ?? '',
                    password: '',
                    repeat_password: '',
                };
                setFormValues(defaultFormValues);
                renewAuthnInfo(responseData.user);
                setTipsMessage({ type: 'success', text: responseData.message });
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

                <TipsBox type={tipsMessage.type ?? ''} txt={tipsMessage.txt ?? ''} />

                <div><TextBox name="action_index" value="update_profile" extra={{ type: 'hidden'}}/></div>

                <div className="widget">
                    <div className="iweb-row">
                        <div className="iweb-grid">
                            <div className="column-2">
                                <TextBox name="username" value={ formValues.username }
                                onChange={ val => setFormValues(prev => ({ ...prev, username: val })) }
                                extra={{ alias: transLang('userName'), isDisabled: true}}/>
                            </div>
                            <div className="column-2">
                                <TextBox name="display_name" value={ formValues.display_name } 
                                onChange={ val => setFormValues(prev => ({ ...prev, display_name: val })) }
                                extra={{ alias: transLang('displayName'), validation: 'required'}}/>
                            </div>
                        </div>
                    </div>

                    <div className="iweb-row">
                        <div className="iweb-grid">
                            <div className="column-2">
                                <TextBox name="telephone" value={ formValues.telephone } 
                                onChange={ val => setFormValues(prev => ({ ...prev, telephone: val })) }
                                extra={{ alias: transLang('telephone'), validation: 'number'}}/>
                            </div>
                            <div className="column-2">
                                <TextBox name="email" value={ formValues.email } 
                                onChange={ val => setFormValues(prev => ({ ...prev, email: val })) }
                                extra={{ alias: transLang('email'), validation: 'email'}}/>
                            </div>
                        </div>
                    </div>
                    <div className="iweb-row">
                        <div className="iweb-grid">
                            <div className="column-2">
                                <TextBox name="password" value={ formValues.password } 
                                onChange={ val => setFormValues(prev => ({ ...prev, password: val })) }
                                extra={{ type: 'password', alias: transLang('password'), validation: 'password'}}/>
                            </div>
                            <div className="column-2">
                                <TextBox name="repeat_password" value={ formValues.repeat_password } 
                                onChange={ val => setFormValues(prev => ({ ...prev, repeat_password: val })) }
                                extra={{ type: 'password', alias: transLang('repeatPassword'), validation: 'password'}}/>
                            </div>
                        </div>
                    </div>
                    <div className="iweb-row">
                        <TextBox name="remark" value="" extra={{ type: 'textarea', alias: transLang('remark') }}/> 
                    </div>
                </div>
            </form>
        </>
    );
}