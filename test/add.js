// 加法函数
function add(x){
    return function(y){
        return x + y;
    }
}

export default add;