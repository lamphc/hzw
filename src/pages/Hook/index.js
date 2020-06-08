import React, { useState, useEffect, useContext, useRef } from 'react';

import './index.css'
let MyContext = React.createContext();



// 递归渲染树菜单
const MenuTree = () => {
  const data = [
    {
      id: '1',
      name: "tree1",
      isOpen: true,
      child: [
        {
          id: '1-1', name: 'ss', isOpen: true, child: [{
            id: '1-1-1',
            name: "tree",
          },
          {
            id: '1-1-2',
            name: "tree",
          }
          ]
        },
        {
          id: '1-2', name: 'ss', isOpen: true, child: [{
            id: '1-2-1',
            name: "tree",
          },
          {
            id: '1-2-2',
            name: "tree",
          }
          ]
        },
        { id: '1-3', name: 'ss', },
      ],
    },
    {
      id: '2',
      name: "tree2",
      isOpen: true,
      child: [
        { id: '2-1', name: 'ss', },
        { id: '2-2', name: 'ss', },
      ],
    },
  ];
  const [menu, setMenu] = useState(data);

  // 递归渲染
  const renderTree = (arr) => {
    return arr.map((item) => {
      return (
        <li key={item.id}>
          <a onClick={() => {
            // 控制折叠
            // 判断是父级
            if (item.child && item.child.length) {
              item.isOpen = !item.isOpen
              setMenu(menu)
            }
          }} className={item.child && item.child.length && 'par'}>{item.name}</a>
          {
            item.child && item.child.length && <ul style={{ display: item.isOpen ? 'block' : 'none' }}>
              {
                renderTree(item.child)
              }
            </ul>
          }

        </li>
      )

    })
  }

  return (
    <ul className="menux">
      {
        renderTree(menu)
      }
    </ul>
  )
}

// 子组件
const Fnc = () => {
  const shareVal = useContext(MyContext);

  return (
    <div>
      <h2>函数子组件</h2>
      <MyContext.Consumer>{(v) => <p>{v}</p>}</MyContext.Consumer>
      <p>通过hook拿到共享数据：{shareVal}</p>
      <hr />
      <MenuTree />

    </div>
  )
}

// 自定义hook:共享count数据
const useCounter = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    return () => {
      clearInterval(id)
    }
  }, [])
  return [count, setCount]
}

function Hook(props) {
  // 设置状态数据
  let [count, setCount] = useState(0);
  let [obj, setObj] = useState({ a: 0 });
  // 调用自定义hook
  let [c, sT] = useCounter()

  //获取ref
  let inputRef = useRef()

  // 钩子函数
  useEffect(() => {
    console.log('加载了｜更新｜卸载！')
    // fetch
  }, [])

  useEffect(() => {
    console.log('加载了｜更新｜卸载！', count)
    // count

    return () => {

    }
  }, [count])


  return (
    <div>
      <h1>体验hook</h1>
      <h2>{c}</h2>
      <p>{count}</p>
      <button onClick={() => {
        // setCount(++count)
        setCount((s) => s + 1)
      }}>add</button>
      <p>{obj.a}</p>
      <button onClick={() => {
        // setCount(++count)
        console.log(inputRef)
        setObj((s) => ({ a: s.a + 10 }))
      }}>add obj</button>
      <input ref={inputRef} type="text" />
      <MyContext.Provider value={count}>
        <Fnc />
      </MyContext.Provider>

    </div>
  );
}

export default Hook;