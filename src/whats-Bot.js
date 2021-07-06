const venom = require('venom-bot');
const {main} = require('./app')
var {top5} = require("./calc-itens-ifood")
const fs = require('fs')


// nlp - machile learnig.
const { NlpManager } = require('node-nlp');

manager = new NlpManager({ languages: ['pt'], forceNER: true });

// Adds the utterances and intents for the NLP => tipos de perguntas
	// saudação
		manager.addDocument('pt', 'Bom dia', 'SAUDACAO.DIA');
		manager.addDocument('pt', 'Bom tarde', 'SAUDACAO.TARDE');
		manager.addDocument('pt', 'Bom noite', 'SAUDACAO.NOITE');
	// Olá.
		manager.addDocument('pt', 'oi', 'SAUDACAO');
		manager.addDocument('pt', 'e ai eai', 'SAUDACAO');
		manager.addDocument('pt', 'e ae eae', 'SAUDACAO');
		manager.addDocument('pt', 'ola', 'SAUDACAO');
		manager.addDocument('pt', 'Hello', 'SAUDACAO');
	// Elogio.
		manager.addDocument('pt', 'bone', 'BONE');
	// negociação
		manager.addDocument('pt', 'pedido', 'PEDIDO');

		manager.addDocument('pt',
		'pizza esfiha esfirra salgado coxinha chocolate doce torta frutas peixe carne frango',
		'COMIDA')
		;

		manager.addDocument('pt', 'av.', 'LOCAL.CLIENTE');
		manager.addDocument('pt', 'r.', 'LOCAL.CLIENTE');
		manager.addDocument('pt', 'avenida', 'LOCAL.CLIENTE');
		manager.addDocument('pt', 'rua', 'LOCAL.CLIENTE');

// Train also the NLG => Como responder
	// saudação
		manager.addAnswer('pt', 'SAUDACAO.DIA', 'Olá, Bom dia! Me faça um pedido que trago uma lista dos produtos mais baratos no ifood pra você');
		manager.addAnswer('pt', 'SAUDACAO.DIA', 'Olá, Bom dia! Como eu poderia te ajudar?');

		manager.addAnswer('pt', 'SAUDACAO.TARDE', 'Olá, Bom tarde! Me faça um pedido que trago uma lista dos produtos mais baratos no ifood pra você');

		manager.addAnswer('pt', 'SAUDACAO.NOITE', 'Olá, Bom noite! Me faça um pedido que trago uma lista dos produtos mais baratos no ifood pra você');
		
		manager.addAnswer('pt', 'SAUDACAO', 'Olá, Tudo bem? Eu faço uma lista dos 5 produtos mais baratos no ifood pra você, faz um pedido ai.');

	// Elogio bone.
		manager.addAnswer('pt', 'BONE', 'Foi meu patrão que me deu de presente por ter feito um bom trabalho!');
		manager.addAnswer('pt', 'BONE', 'Isso é coisa do Rafael');
		manager.addAnswer('pt', 'BONE', 'Foi o Rafael que inventou isso. 🤦‍♂️');
	// negociação
// 		manager.addAnswer('pt',
// 		'PEDIDO',
// 		`Pra fazer seu pedido eu preciso das seguintes informações:

// o seu pedido.
// E O seu endereço completo.
		

// Com essas informções eu vou te passar uma lista começando com os produtos mais baratos.😉

// Primeiro digita o seu pedido pra min. 👇
// 		`);

// 		manager.addAnswer(
// 			"pt",
// 			"LOCAL.CLIENTE",
// 			`Certo, anotei sua localização.
// 		`);
// Train and save the model.		

(async() => {
    await manager.train();
    manager.save();
	//Depois de salvar o treino... executa o whatBot

	// whatsapp bot
	venom
		.create('ifood-Bot')
		.then((client) => {
	client.onMessage( async (message) => {
		if (message.isGroupMsg === false) {
			const response = await manager.process('pt',
			 message.body.toLowerCase()
			);

			if(response.intent === "COMIDA"){
				client.sendText(message.from,"Espere um momento que eu ja trago seu pedido")
				// response.utterance => local				
				await main(response.utterance)
				//esta terminando antes de salvar o main()
				await console.log(`${fs.readdirSync(__dirname+`/responses`)}`)				
				await main().finally(					
					top5().forEach((item) => {
						client.sendText(message.from,item)
					})										
				)
			}

			if(response.intent === "None"){
				client.sendText(message.from,"Por essa eu não esperava!🤔 Me faça uma pergunta que eu saiba responder.")
			}else{
				client.sendText(message.from,response.answer)
			}
			// console.log( "\n" + response + "\n");
			// console.log("Intenção: " + response.intent);
			// console.log("Tipo: " + response.sentiment.type)
			// console.log("Score: " + response.score)
			// console.log("Corpo da Mensagem: " + response.utterance)
		}//if
	});//onMessage	
	})//then
	.catch((erro) => {
		console.log(erro);
	});
})();
