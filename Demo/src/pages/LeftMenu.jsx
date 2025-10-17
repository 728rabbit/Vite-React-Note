import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTips } from '../global/Tips.jsx';
import { useAuthn } from '../global/Authn.jsx';

export default function LeftMenu({ isVisible = true, setIsVisible }) {
    const { renewAuthnToken } = useAuthn();
    const { setTipsMessage } = useTips();
    const [openIndex, setOpenIndex] = useState('home');
    const leftMenu = 
    [
        {
            index: 'home',
            name: '儀表板',
            icon: 'fa-home',
            url: '/'
        },
        {
            index: 'privilege',
            name: '權限',
            icon: 'fa-shield',
            url: '#',
            child: 
            [
                {
                    name: '帳戶',
                    icon: 'fa-user',
                    url: '#'
                },
                {
                    name: '角色',
                    icon: 'fa-lock',
                    url: '#'
                }
            ]
        },
        {
            index: 'profile',
            name: '個人資料',
            icon: 'fa-info-circle',
            url: '/profile'
        },
        {
            name: '登出',
            icon: 'fa-sign-out',
            url: '#',
            islogout: true
        },
    ];

    return (
        <aside className={(['left-menu', ((isVisible) ? 'show': '')].join(' ').trim())}>
        { leftMenu && (
        <ul>
          { leftMenu.map((item, index) => (
            <li key={ index }>
              <Link to={ item.url } onClick={(e) => {
                try {
                    if(item.islogout) {
                        e.preventDefault(); 
                        renewAuthnToken('');
                    }
                    else {
                        setOpenIndex(item.index); 
                        setIsVisible(false);
                    }
                    setTipsMessage({ type: 'none', txt: '' });
                }
                catch(error) {
                    console.error(error);
                }
              }} target={ (item.target ?? '_self') }
              className={([((openIndex == item.index) ? 'current': ''), ((item.child) ? 'parent': '')].filter(Boolean).join(' ').trim())}>
              <FontAwesomeIcon icon={ item.icon }/><span>{ item.name }</span>
              </Link>
              { item.child && (
                <ol className={((openIndex == item.index) ? 'show': '')}>
                  { item.child.map((sub_item, sub_index) => (
                    <li key={ sub_index }>
                        <Link to={ sub_item.url } onClick={() => { setTipsMessage({ type: 'none', text: '' }); }}><FontAwesomeIcon icon={ sub_item.icon }/><span>{ sub_item.name }</span></Link>
                    </li>
                  )) }
                </ol>
              ) }
            </li>
          )) }
        </ul>
        ) }
      </aside>
    );
}