import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthn } from "./Authn.jsx";

export default function LeftMenu({ isVisible = true, setIsVisible }) {
    const { renewAuthnToken } = useAuthn();
    const [openIndex, setOpenIndex] = useState('pages');
    const leftMenu = 
    [
        {
            index: 'pages',
            name: '網站頁面',
            icon: 'fa-book',
            url: '/'
        },
        {
            index: 'herobanner',
            name: '焦點橫幅',
            icon: 'fa-star',
            url: '/about'
        },
        {
            index: 'service',
            name: '服務項目',
            icon: 'fa-heart',
            url: '/contact'
        },
        {
            index: 'mediafile',
            name: '媒體檔案',
            icon: 'fa-cloud-upload',
            url: '#'
        },
        {
            index: 'setting',
            name: '設置',
            icon: 'fa-gears',
            url: '#',
            child: 
            [
                {
                    name: '基本資料',
                    icon: 'fa-info-circle',
                    url: '#'
                },
                {
                    name: '網站XML',
                    icon: 'fa-sitemap',
                    url: '#'
                },
                {
                    name: '第三方代碼',
                    icon: 'fa-code',
                    url: '#'
                },
                {
                    name: '電郵發送',
                    icon: 'fa-envelope',
                    url: '#'
                },
                {
                    name: '電郵收件',
                    icon: 'fa-envelope',
                    url: '#'
                },
                {
                    name: '白名單',
                    icon: 'fa-warning',
                    url: '#'
                }
            ]
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
            url: '#'
        },
        {
            name: '我的網站',
            icon: 'fa-desktop',
            url: '#',
            target: '_blank'
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
                        <Link to={ sub_item.url }><FontAwesomeIcon icon={ sub_item.icon }/><span>{ sub_item.name }</span></Link>
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