//全局过滤器
export function formatDate (value, format) {
    //value: 2020-07-08T02:40:51.000Z
    //format: yyyy-MM-dd hh:mm:ss
    let current = new Date(value);
  
    //获取年份
    let year= current.getFullYear();
    // console.log('year ==> ', year);
    if (/(y+)/.test(format)) {
      //获取匹配组的内容
      let yearContent = RegExp.$1;
      // console.log('yearContent ==> ', yearContent);
  
      format = format.replace(yearContent, year);
    }
  
    //处理月日时分秒
    let dateObject = {
      M: current.getMonth() + 1,
      d: current.getDate(),
      h: current.getHours(),
      m: current.getMinutes(),
      s: current.getSeconds()
    };
  
    for (let key in dateObject) {
      //创建动态正则表达式
      let reg = new RegExp(`(${key}+)`)
      // console.log('reg ==> ', reg);
      if (reg.test(format)) {
        //获取匹配组的内容, RegExp.$n必须需要test验证通过可以获取
        let content = RegExp.$1;
        // console.log('content ==> ', content);
  
        //控制补零
        let value = dateObject[key] >= 10 ? dateObject[key] : content.length == 2 ? '0' + dateObject[key] : dateObject[key];
        format = format.replace(content, value);
      }
    }
    return format;
  }