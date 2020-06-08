import React, { useState, useEffect, useContext, useRef } from 'react';


let MyContext = React.createContext();


// 子组件
const Fnc = () => {

  const shareVal = useContext(MyContext);

  return (
    <div>
      <h2>函数子组件</h2>
      <MyContext.Consumer>{(v) => <p>{v}</p>}</MyContext.Consumer>
      <p>通过hook拿到共享数据：{shareVal}</p>
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