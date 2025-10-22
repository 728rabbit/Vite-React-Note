import { useEffect, useState } from 'react';
import { useLayout } from '../global/Layout.jsx';
import { useLang } from '../global/Language.jsx';
import { useTips } from '../global/Tips.jsx';
import { submitForm } from '../helper/Form.jsx';
import TextBox from '../units/TextBox';

export function Home() {
    // Global value
    const { transLang } = useLang();
    const { tipsMessage, setTipsMessage } = useTips();
    const { setPageExpand, setPagePath } = useLayout();
    const [rows, setRows] = useState([{
        id: 1,
        name: 1,
        price: 0,
        qty: 1
    }]);

    // Init
    useEffect(() => {
        setPageExpand(false);
        setPagePath([{ name: transLang('dashBoard'), url: '/'}]);
    }, []);

    
    function addRow(position = 'end') {
        const newId = rows.length > 0 ? Math.max(...rows.map(row => row.id)) + 1 : 1;
        const newRow = {
            id: newId,
            name: newId,
            price: 0,
            qty: 1
        };
        
        if (position === 'end') {
            // 在末尾添加
            setRows([...rows, newRow]);
        } else {
            // 在指定位置插入
            const index = typeof position === 'number' ? position : 0;
            const newRows = [...rows];
            newRows.splice(index, 0, newRow);
            setRows(newRows);
        }
    };

    // 新增：在指定行后面插入
    function insertAfter(id) {
        const index = rows.findIndex(row => row.id === id);
        if (index !== -1) {
            addRow(index + 1);
        }
    }

    // 新增：在指定行前面插入
    function insertBefore(id) {
        const index = rows.findIndex(row => row.id === id);
        if (index !== -1) {
            addRow(index);
        }
    }

    function deleteRow(id) {
        alert(id);
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        }
    }

    return (
        <>
            <h1>首頁</h1>

            <form onSubmit={(e) => submitForm(e, transLang, function(responseData) {
                console.log(responseData);
            })}>
            <div className="widget">
                { rows && (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Total</th>
                                    <th>操作</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    rows.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <TextBox 
                                                    name={`item_name[${item.id}]`}
                                                    value={item.name} 
                                                    extra={{'id': 'item_name_' + item.id}}
                                                    onChange={(val) => {
                                                        setRows(rows.map(row => 
                                                            row.id === item.id ? { ...row, 'name': val } : row
                                                        ));
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <TextBox 
                                                    name={`unit_price[${item.id}]`}
                                                    value={item.price} 
                                                    extra={{'id': 'unit_price_' + item.id}}
                                                    onChange={(val) => {
                                                        setRows(rows.map(row => 
                                                            row.id === item.id ? { ...row, 'price': val } : row
                                                        ));
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <TextBox 
                                                    name={`qty[${item.id}]`}
                                                    value={item.qty} 
                                                    extra={{'id': 'qty_' + item.id}}
                                                    onChange={(val) => {
                                                        setRows(rows.map(row => 
                                                            row.id === item.id ? { ...row, 'qty': val } : row
                                                        ));
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                { item.price * item.qty }
                                            </td>
                                            <td>
                                                <button type="button" onClick={() => insertBefore(item.id)}>
                                                    在前面插入
                                                </button>
                                                <button type="button" onClick={() => insertAfter(item.id)}>
                                                    在后面插入
                                                </button>
                                                <button type="button" onClick={() => deleteRow(item.id)}>
                                                    删除
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>

                            <tfoot>
                                <tr>
                                    <td colSpan="6">
                                        <button type="button" onClick={() => addRow('end')}>
                                            + 在末尾添加
                                        </button>

                                        <button type="submit">
                                            提交
                                        </button>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </>
                )}
            </div>
            </form>
        </>
    );
}
