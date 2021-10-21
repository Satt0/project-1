const {TokenValidation}=require('./token')

test('check sign jwt', () => {
    const tokenValidtator=new TokenValidation();
    const data={name:"tan"}
    const jwt= tokenValidtator.signJWT(data)
    expect(typeof jwt).toBe("string");
  });
test('check validate jwt',()=>{
    const tokenValidtator=new TokenValidation();
    const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGFuIiwiaWF0IjoxNjM0Nzc4NjU5fQ.IfP6vQ8TUGjgajS3nDEN5JEp5Mu0W7Xh913fLUAzCSo"
    const data= tokenValidtator.validateJWT(token)
    expect(typeof data).toBe("object");
})