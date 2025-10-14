import { useState } from "react";
import { Routes, Route, Link} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import favIcon from './assets/fav.png';
import LeftMenu from "./leftMenu.jsx";
import TxtBox from "./units/TxtBox.jsx";
import SelectBox from "./units/SelectBox.jsx"; 

export default function App() {
    const [menuVisible, setMenuVisible] = useState(false);

      /**
   * 驗證表單並在對應欄位下顯示錯誤訊息
   * @param {HTMLFormElement} form
   * @returns { boolean } 是否通過
   */
    function validateForm(form) {
      let valid = true;

      // 先清空之前的錯誤訊息
      const existingErrors = form.querySelectorAll('small.tips');
      existingErrors.forEach(err => err.remove());

      const processedCheckboxes = new Set();
      const processedRadios = new Set();

      for (let element of form.elements) {
        if (!element.name) continue;

        const validation = element.dataset.validation;
        if (!validation) continue;

        const rules = validation.split('|');
        let elementValid = true;
        let messages = [];

        for (let rule of rules) {
          // required
          if (rule === 'required') {
            if (element.type === 'checkbox') {
              if (processedCheckboxes.has(element.name)) continue;
              processedCheckboxes.add(element.name);
              const checkboxes = form.querySelectorAll(`input[name="${element.name}"]`);
              const checked = Array.from(checkboxes).some(cb => cb.checked);
              if (!checked) {
                elementValid = false;
                messages.push('必填');
              }
            } else if (element.type === 'radio') {
              if (processedRadios.has(element.name)) continue;
              processedRadios.add(element.name);
              const radios = form.querySelectorAll(`input[name="${element.name}"]`);
              const checked = Array.from(radios).some(r => r.checked);
              if (!checked) {
                elementValid = false;
                messages.push('必填');
              }
            } else {
              if (!element.value || element.value.trim() === '') {
                elementValid = false;
                messages.push('必填');
              }
            }
          }

          // email
          else if (rule === 'email') {
            if (element.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(element.value)) {
              elementValid = false;
              messages.push('格式錯誤 (Email)');
            }
          }

          // date
          else if (rule === 'date') {
            if (element.value && !/^\d{4}-\d{2}-\d{2}$/.test(element.value)) {
              elementValid = false;
              messages.push('格式錯誤 (YYYY-MM-DD)');
            }
          }

          // time
          else if (rule === 'time') {
            if (element.value && !/^\d{2}:\d{2}$/.test(element.value)) {
              elementValid = false;
              messages.push('格式錯誤 (HH:MM)');
            }
          }

          // regex
          else if (rule.startsWith('regex:')) {
            const pattern = rule.replace('regex:', '');
            const regex = new RegExp(pattern);
            if (element.value && !regex.test(element.value)) {
              elementValid = false;
              messages.push('格式錯誤');
            }
          }
        }

        console.log(messages);

        // 如果有錯誤，插入到 input 下方
        if (!elementValid) {
          valid = false;
          const errorDiv = document.createElement('small');
          errorDiv.className = 'tips';
          errorDiv.textContent = messages.join(', ');

          const wrapper = element.closest('div.iweb-input') || element.parentElement;
          wrapper.classList.add('error');
          wrapper.appendChild(errorDiv);
        }
      }

      console.log(valid);

      return valid;
    }



    function handleSubmit(e) {
      e.preventDefault(); // 阻止頁面刷新

      const form = e.target;

      const valid = validateForm(form);

      if (!valid) {
        alert('表單驗證失敗');
        return;
      }

      const formData = new FormData();

      // 遍歷表單元素
      const processedNames = new Set();
      for (let element of form.elements) {
        if (!element.name) continue;

        if (element.type === "checkbox") {
          if (processedNames.has(element.name)) continue; // 已處理過
          processedNames.add(element.name);

          const checkboxes = form.querySelectorAll(`input[name="${element.name}"]`);
          const values = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
          values.forEach(v => formData.append(element.name + '[]', v));

        } else if (element.type === "radio") {
          if (element.checked) formData.append(element.name, element.value);
        } else {
          formData.append(element.name, element.value);
        }
      }


      // 發送到 PHP
      fetch("http://localhost:8000/myprojects/mylib/postest.php", {
        method: "POST",
        body: formData,
      })
        .then(res => res.text())
        .then(data => {
          console.log("PHP 回傳:", data);
        })
        .catch(err => console.error(err));
    }

    function Home() {
      return (
        <>
          <h1>首頁</h1>
            <form id="demoform" method="post" action="http://localhost:8000/myprojects/mylib/postest.php"
            onSubmit={handleSubmit}>
              <div className="widget">
                <div className="iweb-row">
                    <TxtBox name="owner_name" value="ABC" extra={{ alias: '網站名稱', validation: 'required'}}/>
                </div>
                <div className="iweb-row">
                    <TxtBox name="owner_date" value="" extra={{ type: 'date', alias: '日期', validation: 'required|date'}}/>
                </div>
                <div className="iweb-row">
                    <TxtBox name="owner_time" value="" extra={{ type: 'time', step: 1800, alias: '時間', validation: 'required|time'}}/>
                </div>
                <div className="iweb-row">
                    <TxtBox name="theme_color" value="" extra={{ type: 'color', alias: '主題色'}}/>
                </div>
                <div className="iweb-row">
                    <TxtBox name="owner_email" value="" extra={{ type: 'email', alias: '電郵', validation: 'required|email'}}/>
                </div>
                <div className="iweb-row">
                    <TxtBox name="password" value="" extra={{ type: 'password', alias: '密碼', validation: 'required|passowrd'}}/>
                </div>
                <div className="iweb-row">
                    <TxtBox name="owner_description" value="Hello world" extra={{ type: 'textarea', alias: '網站名稱',}}/>
                </div>
                <div className="iweb-row">
                    <SelectBox
                      name="category"
                      value=""
                      options={
                      [
                        {value: 1, label: "科技"}, 
                        {value: 2, label: "生活"}, 
                        {value: 3, label: "教育"}
                      ]}
                      extra={{ alias: "分類", validation: 'required' }}
                      onChange={(e) => console.log('選中值:', e.target.value)}
                    />
                </div>
                <div className="iweb-row">
                    <SelectBox
                      name="hobby"
                      value={['1','3']}
                      options={[
                        { value: '1', label: '閱讀' },
                        { value: '2', label: '旅行' },
                        { value: '3', label: '音樂' },
                      ]}
                      extra={{ alias: '興趣', type: 'checkbox', validation: 'required' }}
                      onChange={(e) => console.log('選中值:', e.target.value)}
                    />
                </div>
                <div className="iweb-row">
                    <SelectBox
                      name="gender"
                      value="M"
                      options={[
                        { value: "M", label: "男" },
                        { value: "F", label: "女" },
                      ]}
                      extra={{ alias: "性別", type: "radio", validation: 'required' }}
                      onChange={(e) => console.log('選中值:', e.target.value)}
                    />
                </div>
                <div className="iweb-row">
                  <button type="submit">提交</button>
                </div>
              </div>
            </form>
        </>
      );
    }

    function About() {
      return <h1>關於我們</h1>;
    }

    function Contact() {
      return <h1>聯絡我們</h1>;
    }

  return (
    <>
      <header className="page-header">
          <div className="logo">
              <Link to="#">
                  <img src={ favIcon } alt="logo-small"/>
                  <span>網站管理平臺<br/><small>Website Management</small></span>
              </Link>
          </div>
          <div className="open">
              <Link onClick={() => setMenuVisible(!menuVisible)}><FontAwesomeIcon icon="fa-indent" className="icon-white"/></Link>
          </div>
          <div className="welcome">
              <Link to="/about">Hi, <u>Admin</u></Link>
          </div>
      </header>
      <LeftMenu isVisible={menuVisible} setIsVisible={setMenuVisible}/>
      <nav className="path">
          <div>
              <ul>
                <li><Link to="#">網站頁面</Link></li>
              </ul>
          </div>
      </nav>
      <main className="page-body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
   </>
  );
}