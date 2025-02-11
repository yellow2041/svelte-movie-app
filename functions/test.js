export.handler = async function(event, context)  {
  return {
    statusCode: 200,
    body: JSON.stringify({
      name:'NELL',
      age: 44,
      email:'official@spacebohemian.com'
    })
  };
};
