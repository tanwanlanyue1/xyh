import add from './add';

describe("运算功能单元测试",function(){
    it("加法函数测试",function(){
        var add5 = add(5);
        expect(add5(5)).toBe(10)
    });
})