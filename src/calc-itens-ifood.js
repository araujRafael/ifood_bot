const fs = require("fs")

module.exports = {
    top5,
  }
  
function top5() {
  var item = fs.readdirSync(__dirname+"/responses")
  var response = require(`./responses/${item}`)

  let tempArray = []

  response.map(item => {
  let total = Number(item.custo.replace("A partir de","").trim()) + Number(item.entrega)

    tempArray.push({
      total: (total).toFixed(2),
      name:item.nome,
      price: item.custo.replace("A partir de","").trim(),
      delivery: item.entrega,
      link:item.link
    });


  })
  tempArray.sort((a,b)=>{
  return a.total - b.total
  })
  let messages = []

  tempArray.forEach((item )=> {	
    messages.push(`
    Titulo: ${item.name} 

    Link: 
    ${item.link} 
    Preço: ${item.price} Entrega: ${item.delivery} 
    Total: ${item.total}`)
  })

  return messages.slice(0,5)

  // console.log(messages.slice(0,5))
 
}