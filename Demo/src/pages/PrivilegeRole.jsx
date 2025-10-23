import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useLayout } from '../global/Layout.jsx';
import { useLang } from '../global/Language.jsx';
import { useTips } from '../global/Tips.jsx';
import { TipsBox } from '../units/TipsBox.jsx';
import TextBox from "../units/TextBox.jsx";
import SelectBox from '../units/SelectBox.jsx';
import { Link } from 'react-router-dom';

export function PrivilegeRole() {
    // Global value
    const { setPageIndex, setPagePath, setPageExpand } = useLayout();
    const { transLang } = useLang();
    const { tipsMessage, setTipsMessage } = useTips();

    const [keywords, setKeywords] = useState('');
    const [listData, setListData] = useState(null);
    const [listSelected, setListSelected] = useState([]);

    // Init
    useEffect(() => {
        setPageIndex('privilege');
        setPagePath([
            { name: transLang('privilege'), url: '#'},
            { name: transLang('role'), url: '/privilege/role'}
        ]);
        setPageExpand(false);

        setListData([
        {
            'id': 1,
            'name': '高級管理員',
            'ischecked': false
        },
        {
            'id': 2,
            'name': '管理員',
            'ischecked': false
        }
        ]);
    }, []);

    // Fucntions
    const autoSelectAll = () => {
        let values = [];
        if(listSelected.length === 0 || listData.length != listSelected.length) {
            listData.map((item) => {
                values.push(item.id);
            });
        }
        setListSelected(values);
    }

    const setAutoSelect = (find) => {
        let newValues = listSelected ? [...listSelected] : [];
        if (newValues.includes(find)) {
            newValues = newValues.filter(v => v !== find);
        } else {
            newValues = [...newValues, find];
        }
        setListSelected(newValues);
    }

    const deleteListSelected = () => {
        if(listSelected.length) {
            console.log(listSelected);
        }
    }

    // View
    return (
        <>
          <div className="t-list">
                <div className="widget thin top">
                    <div className="filter">
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <TextBox name="keywords" 
                                        value={keywords} 
                                        extra={{ placeholder: '請輸入關鍵字' }}
                                        onChange={ (val) => setKeywords(val) }
                                        />
                                    </td>
                                    <td>
                                        <button type="submit" className="btn btn-green">
                                            <FontAwesomeIcon icon="fa-search"/><span>搜尋</span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="controls">
                        <button type="button" className="btn btn-red btn-delete-item"
                        onClick={deleteListSelected}>
                            <FontAwesomeIcon icon="fa-trash"/><span>{ transLang('btnDelete') }</span>
                        </button>

                        <Link to="/privilege/role/add" className="btn btn-yellow btn-add-item"
                        onClick={() => {setTipsMessage({ type: 'none', text: '' })}}>
                            <FontAwesomeIcon icon="fa-plus"/><span>{ transLang('btnAdd') }</span>
                        </Link>
                    </div>
                    <div className="clearboth"></div>
                </div>

                <TipsBox type={tipsMessage.type ?? ''} text={tipsMessage.text ?? ''} />
                
                { listData ? (
                    <>
                        <div className="widget middle">
                            <table className="list iweb-rtable">
                                <thead>
                                    <tr>
                                        <th className="index-col fixed-width" style={{ width: '40px', textAlign: 'center'}}>
                                            <div>
                                                <SelectBox 
                                                name="list_index[]"
                                                options={[{ value: -1 }]}
                                                value={(listData.length === listSelected.length)? [-1] : [0]}
                                                extra={{ type: 'checkbox', id: ('list_index_all') }}
                                                onChange={autoSelectAll}/>
                                            </div>
                                        </th>
                                                        
                                        <th className="dynamic-width">
                                            <div>
                                                <span>{ transLang('displayName') }</span>
                                                <div className="sortable">
                                                    <div>
                                                        <a className="sorting asc" title="ASC" data-value="name_asc">
                                                            <FontAwesomeIcon icon="fa-caret-up"/>
                                                        </a>
                                                        <a className="sorting desc" title="DESC" data-value="name_desc">
                                                            <FontAwesomeIcon icon="fa-caret-down"/>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </th>    
                                        <th style={{ width: '80px', textAlign: 'center' }} className="fixed-width"><div>操作</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listData.map((item, index) => (
                                        <tr key={index}>
                                            <td className="index-col" style={{ textAlign: 'center' }}>
                                                <div>
                                                    <SelectBox 
                                                    name={`list_index_${item.id}`}
                                                    options={[{ value: item.id}]}
                                                    value={listSelected?.includes(item.id) ? [item.id] : []}
                                                    extra={{ type: 'checkbox', id: ('list_index' + item.id) }}
                                                    onChange={() => setAutoSelect(item.id)}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <span>{item.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ width: '80px', textAlign: 'center' }}>
                                                <div>
                                                    <Link to={`/privilege/role/edit/${item.id}`}
                                                    onClick={() => {setTipsMessage({ type: 'none', text: '' })}}>
                                                        <FontAwesomeIcon icon="fa-pencil"/>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="widget thin bottom">
                                <div className="list-total">顯示 1 到 1，共 1 筆記錄。</div>
                                <div className="clearboth"></div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="widget middle">
                            <div className="empty">- 找不到相關記錄 -</div>
                        </div>
                    </>
                ) }
            </div>  
        </>
    );
}