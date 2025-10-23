import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLayout } from '../global/Layout.jsx';
import { useLang } from '../global/Language.jsx';
import { useTips } from '../global/Tips.jsx';
import { submitForm } from "../helper/Form.jsx";
import { TipsBox } from '../units/TipsBox.jsx';
import TextBox from "../units/TextBox.jsx";
import SelectBox from '../units/SelectBox.jsx';


export function PrivilegeRoleForm() {
    // Global value
    const { setPageIndex, setPagePath, setPageExpand } = useLayout();
    const { transLang } = useLang();
    const { tipsMessage, setTipsMessage } = useTips();
    const navigate = useNavigate();

    const { id } = useParams();
    let defaultFormValues = {
        id: 0,
        name: '',
        remark: ''
    };
    if(id && id > 0) {
        defaultFormValues = {
            id: 1,
            name: '高級管理員',
            remark: ''
        };
    }
    const [formValues, setFormValues] = useState(defaultFormValues);
    
    // Init
    useEffect(() => {
        setPageIndex('privilege');
        setPagePath([
            { name: transLang('privilege'), url: '#'},
            { name: transLang('role'), url: '/privilege/role'},
            (id && id > 0) ? { name: transLang('btnEdit'), url: '/privilege/role/edit/' + id} : { name: transLang('btnAdd'), url: '/privilege/role/add'}
        ]);
        setPageExpand(true);
    }, []);

    // View
    return (
        <>
            <form onSubmit={(e) => submitForm(e, transLang, function(responseData) {
                setTipsMessage({ type: 'success', text: responseData.message });
                navigate('/privilege/role');
            })}>
                <div className="widget thin top fixed">
                    <div className="controls">
                        <button type="button" className="btn btn-red" onClick={() => { setFormValues(defaultFormValues); }}>
                            <FontAwesomeIcon icon="fa-undo"/><span>{transLang('btnReset')}</span>
                        </button>
                        <button type="submit" className="btn btn-green">
                            <FontAwesomeIcon icon="fa-save"/><span>{transLang('btnSave')}</span>
                        </button>
                    </div>
                    <div className="clearboth"></div>
                </div>

                <TipsBox type={tipsMessage.type ?? ''} text={tipsMessage.text ?? ''} />

                <div><TextBox name="action_index" value="update_role" extra={{ type: 'hidden'}}/></div>

                <div className="widget">
                    <div className="iweb-row">
                        <TextBox 
                        name="name" 
                        value={ formValues.name }
                        extra={{ alias: transLang('displayName')}}
                        onChange={ (val) => setFormValues(prev => ({ ...prev, name: val })) }     
                        />   
                    </div>
                </div>
            </form>
        </>
    );
}