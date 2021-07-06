const puppeteer = require('puppeteer');
const fs = require('fs')
const response = "/responses"


async function main(pedido) {
    let ITEM = pedido
    let END_POINT = `https://www.ifood.com.br/busca?q=${ITEM}`
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
    
    await page.goto(END_POINT)

    await page.click('#marmita-tab1-1')
    await page.click('#marmita-tab1-1')
    .then(
        await page.waitForSelector(".dish-card-wrapper",{timeout:0}).catch(err => {
            console.log(err);
        })
    )
    .then(
        await page.evaluate(()=>{
            
            return Promise.resolve( Array.from(document.querySelectorAll(".dish-card-wrapper")).map(item => {
            
                var obj = {
                    // img: item.querySelector(".dish-card__container-image [src]").getAttribute('src'),
                    
                    nome: item.querySelector(".dish-card__description").textContent,
                    
                    custo: '',

                    entrega: '',
                    
                    link: `https://www.ifood.com.br${item.querySelector("[href]").getAttribute('href')}`,
                    
                    rating: item.querySelector(".restaurant-rating").textContent,
                }
                
                //Preço

                if(item.querySelector('.dish-card__price--discount')){

                    obj.custo = String(item.querySelector('.dish-card__price--discount').firstChild.textContent).replace('R$ ','').replace(",",".")          

                }else{
                    let price = String(item.querySelector('.dish-card__price').textContent)

                    obj.custo = price.replace('R$ ','').replace(",",".").replace("A partir de","").trim()   
                }

                //Entrega

                if(item.querySelector(".dish-card-delivery__free-delivery")){
                    obj.entrega = "0.00"
                }else{
                    obj.entrega = String(item.querySelector(".dish-card-delivery__fee").textContent).replace('Entrega R$ ','').replace(",",".")
                }
                
                return obj
    
            }) )//Promise

        })//evaluete
        .then(el => {
            const readdir = fs.readdirSync(__dirname+response)
            fs.unlinkSync(__dirname+response+`/${readdir}`)  
            // console.log(el);            
            fs.writeFileSync(__dirname + response + `/products-${ITEM}.json`,JSON.stringify(el,null,2))

            
        }).then(
            console.log("Raspagem de Produtos Concluida com Sucesso!")
        ).catch(
            err => console.error(err)
        )
    ).catch(err => {
        console.error(err);
    })


    await browser.close();
};

module.exports = {
    main,
}