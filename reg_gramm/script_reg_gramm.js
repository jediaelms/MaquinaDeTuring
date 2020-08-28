var str1;
var str2;
var cont;
var econt;
var contS; //Contador para verificar se possui o estado inicial 'S'
var contT; //Contador para não-terminais
var counter = 1;
var limit = 100000;

function addInput(divName){
     if (counter == limit)  {
          alert("You have reached the limit of adding " + counter + " inputs");
     }
     else {
          var newdiv = document.createElement('div');
          newdiv.innerHTML = "<input type='text' name='myInputs[]' style='margin-top: 5px; height:35px; width:300px; font-size: 20px'>";
          document.getElementById(divName).appendChild(newdiv);
          counter++;
     }
}

function getString(){
	str1 = [];
	str2 = [];
	cont = 0;
	econt = 0;
	contS = 0;
	contT = 0;

	var str  = document.getElementsByName('myInputs[]');
	var text = document.getElementById('str');
	var erro;

	for(i = 0; i < str.length; i++){
		if(str[i].value.length!=0){
			erro = cropString(str[i].value); //Chama função de cortar String
			if(erro == 0){
				str[i].style.backgroundColor = "red"; //Se estiver errada a linha, deixa ela vermelha
			}
			else{
				str[i].style.backgroundColor = "LightGreen";
			}
		}
		cont++;
	}
	
	if(contS == 0){  //Não tem o não-terminal inicial 'S'
		alert("Estado inicial 'S' nao criado!");
		return;
	}
	if(contT == 0){
		alert("Nao existem terminais!");
		return;
	}	
	if(econt != 0){
		alert("Erro de sintaxe na gramatica!");
		return;
	}
	else{
		if(text.value.length == 0){
			if(reachVoid("S")){
				text.style.backgroundColor = "LightGreen";
			}
			else{
				text.style.backgroundColor = "red";
			}
		}
		else if(verifyGrammar(text.value, 0,"S",0,0)){
			text.style.backgroundColor = "LightGreen";
		}
		else{
			text.style.backgroundColor = "red";
		}
	}
}

function cropString(str){
	var cont2 = 0; //Contador que itera pela string
	var cont3 = 0; //Contador de não-terminais por linha - Não pode ser maior que 1
	var cont4 = 0; //Contador de elementos depois do -
	var contT2 = 0; //Contador de terminais por linha
	var contV = 0; //Contador de vazios por linha (Só pode ter o vazio na linha)

	if((/[A-Z]/.test(str[cont2]))){
		if(str[cont2]=="S"){
			contS++;
		}
		str1[cont] = str[cont2];
		cont2++;
	} 
	else{      //Não tem um não-terminal no começo
		econt++;
		return 0;
	}
	while(str[cont2]==" "){
		cont2++;
	}
	if(str[cont2]=="-"){
		cont2++;
	}
	else{       //Não tem o -
		econt++;
		return 0;
	}
	while(str[cont2]==" "){
		cont2++;
	}
	str2[cont] = [];
	if(cont2 >= str.length){ //Não tem algo depois do -
		econt++;
		return 0;
	}
	while(cont2 < str.length){
		
		if((/[a-z]/.test(str[cont2])) || (/[0-9]/.test(str[cont2]))){
			if(cont3 > 0){  //Não pode ter terminais à direita
				
				econt++;
				return 0;
			}
			str2[cont][cont4] = str[cont2];
			cont2++;
			cont4++;
			contT++;
			contT2++;
		}
		else if(str[cont2]=="@"){
			if(cont4>0){
				
				econt++;
				return 0;
			}
			str2[cont][cont4] = str[cont2];
			cont2++;
			cont4++;
			contV++;
			contT++;
		}
		else if((/[A-Z]/.test(str[cont2]))){
			
			str2[cont][cont4] = str[cont2];
			cont2++;
			cont3++;
			cont4++;
		}
		

		if(contV > 0){
			
			if(cont3 > 0 || contT2 > 0){
				econt++;
				return 0;
			}
			if(contV > 1){
				econt++;
				return 0;
			}
		}
		if(cont3 > 1){  //Mais de um não-terminal
			
			econt++;
			return 0;
		}
		if(contT2 > 1){ //Tem mais de um Terminal
			econt++;
			return 0;
		}
		if(str[cont2]==" "){  //Espaços no meio
			
			econt++;
			return 0;
		}
	}
	return 1;
}


function reachVoid(letter){
	console.log("Flag");
	let str5 = [];

	let cont6 = 0;

	for(let i = 0; i < str1.length; i++){
		if(str1[i]==letter && str2[i].length==1){
			if(str2[i][0] == "@"){
				return 1;
			}
			else if(((/[A-Z]/.test(str2[i][0]))) && str2[i][0]!=letter){
				str5[cont6] = str2[i];
				cont6++; 
			}
		}
	}

	for(let i = 0; i <str5.length; i++){
		if(reachVoid(str5[i][0])){
			return 1;
		}
	}

	return 0;
}


function searchLines(c,vet){
	var cont5 = 0;
	for(i = 0; i < str1.length; i++){
		if(str1[i]==c){
			vet[cont5] = str2[i];
			cont5++; 
		}
	}
	if(cont5 == 0){
		alert("Variavel nao declarada na gramtica.");
		return 0;
	}
	else{
		return 1;
	}
}

function verifyFinal(l, l2){
	
	let str4 = [];

	let cont5 = 0;

	for(let i = 0; i < str1.length; i++){
		if(str1[i]==l2){
			str4[cont5] = str2[i];
			cont5++; 
		}
	}

	
	for(let i = 0; i < str4.length; i++){
		if(str4[i].length == 1){
			if(((str4[i][0] == l)||(str4[i][0]=="@"))){
				return 1;
			}
			else if(((/[A-Z]/.test(str4[i][0])))){
				if(str4[i][0] != l2){
					if(verifyFinal(l, str4[i][0])){
						return 1;
					}
				}
			}
		}
	}
	return 0;
}

function verifyGrammar(text, contIt, letter, end){

	let contItt = contIt;

	if(contItt > text.length){
		return 0;
	}
	
	let str3 = [];
	let tam = 0;
	let cont5 = 0;

	for(let i = 0; i < str1.length; i++){ // Pega as derivações correspondentes à variável atual
		if(str1[i]==letter){
			str3[cont5] = str2[i];
			cont5++; 
		}
	}
	if(cont5 == 0){
		alert("Variavel nao declarada na gramatica.");
		return 0;
	}

	if(end==1){ //Palavra já acabou - Procurando Vazio
		for(i = 0; i < str3.length; i++){
			tam = str3[i].length;
			if(tam==1){
				if(str3[i][0]=="@"){
					return 1;
				}
			}
		}
		if(verifyFinal("%",letter)){
			return 1;
		}
		return 0;
	}

	str3.sort(function(a,b){
 		return a.length - b.length;
	});

	for(let i = 0; i < str3.length; i++){
		tam = str3[i].length;
		if (tam==1){ // Quando tem só uma letra depois do -
			if(((/[A-Z]/.test(str3[i][0])))){
				if(verifyGrammar(text,contItt,str3[i][0],0)){
					
					console.log("Retorna na parte de x");
					return 1;//Sucesso
				}
				else{
					
				}
			}
			else{
				if(str3[i][0]==text[contItt]){
					
					
					if(contItt+1 == text.length){
						contItt++;
						return 1;
					}

					
				}
			}
		}
		else if(tam===2){ // Quando tem duas letras depois do -
			if(str3[i][0]==text[contItt]){

				contItt++;
				if(contItt == text.length){

					if(verifyGrammar(text,contItt,str3[i][1],1)){
						console.log("Retorna no vazio");
						return 1;
					}

					if(verifyFinal(str3[i][0],letter)){
						console.log("Retorna no verifyFinal");
						return 1;
					}
					console.log("Tentou verificar final.");
				}
				else{
					console.log("Entra chamada");
					if(verifyGrammar(text,contItt,str3[i][1],0)){
						
						console.log("Retorna na parte de xY");
						return 1;
					}
				}
				contItt--;
			}
			
		}	
	}
	return 0; // Não encontra correspondencia
}

// --------------------  CONVERSÃO ----------------------------

var aut1 = [];
var aut2 = [];
var arq = "";

function procuraEstado(est){
	for(let i = 0; i < aut1.length; i++){
		if(aut1[i] == est) return 1;
	}
	return 0;
}

function montaAutomato(){
	// Estados
	let estds = 0;
	for(let i = 0; i < str1.length; i++){
		if(!procuraEstado(str1[i])){
			aut1[estds] = str1[i];
			estds++;
		}
	}
	aut1[estds] = "Final";

	//Transições
	let estds2 = 0;
	for(let i2 = 0; i2 < str2.length; i2++){
		if(str2[i2].length == 1){
			if(((/[A-Z]/.test(str2[i2][0])))){
				aut2[estds2] = [str1[i2],str2[i2][0],"@"];
				estds2++;
			}
			else{
				aut2[estds2] = [str1[i2],"Final",str2[i2][0]];
				estds2++;
			}
		}
		else{
			aut2[estds2] = [str1[i2],str2[i2][1],str2[i2][0]];
			estds2++;
		}
	}

	console.log(aut1);
	console.log(aut2);

	var estados = JSON.stringify(aut1);
	var transicoes = JSON.stringify(aut2);
	sessionStorage.clear();
	sessionStorage.setItem('est', estados );
	sessionStorage.setItem('tr', transicoes);
	window.open("../fin_autom/index.html?remetente=gramatica", "_blank");
}

function converteGramatica(){
	str1 = [];
	str2 = [];
	cont = 0;
	econt = 0;
	contS = 0;
	contT = 0;

	var str  = document.getElementsByName('myInputs[]');
	var erro;

	for(i = 0; i < str.length; i++){
		if(str[i].value.length!=0){
			erro = cropString(str[i].value); //Chama função de cortar String
			if(erro == 0){
				str[i].style.backgroundColor = "red"; //Se estiver errada a linha, deixa ela vermelha
			}
			else{
				str[i].style.backgroundColor = "LightGreen";
			}
		}
		cont++;
	}
	
	if(contS == 0){  //Não tem o não-terminal inicial 'S'
		alert("Estado inicial 'S' nao criado!");
		return;
	}
	if(contT == 0){
		alert("Nao existem terminais!");
		return;
	}	
	if(econt != 0){
		alert("Erro de sintaxe na gramatica!");
		return;
	}
	else{
		montaAutomato();
	}
}

function CapturaParametrosUrl() {
	var url = window.location.href;
	var res = url.split('?');

	if (res[1] !== undefined) {
	  var parametros = res[1].split('=');
	  if (parametros[0] == 'remetente' && parametros[1] == "automato") {
		var transicoes = JSON.parse(sessionStorage.getItem('tr'));
		console.log(transicoes);
		var i;
		for (i = 0; i < transicoes.length - 1; i++) {
			addInput('dynamicInput');
		}
		var campos = document.getElementsByName('myInputs[]');
		for (i = 0; i < campos.length; i++) {
			if(transicoes[i].length == 3){
				campos[i].value = transicoes[i][0] + "-" + transicoes[i][1] + transicoes[i][2];
			}
			else{
				campos[i].value = transicoes[i][0] + "-" + transicoes[i][1];
			}
		}
	  }
	}
  }


/*
{ "class": "go.GraphLinksModel",
  "nodeKeyProperty": "id",
  "nodeDataArray": [
    { "id": 0, "loc": "120 120", "text": "Initial" },
    { "id": 1, "loc": "330 120", "text": "First down" },
    { "id": 2, "loc": "226 376", "text": "First up" },
    { "id": 3, "loc": "60 276", "text": "Second down" },
    { "id": 4, "loc": "226 226", "text": "Wait" }
  ],
  "linkDataArray": [
    { "from": 0, "to": 0, "text": "up or timer", "curviness": -20 },
    { "from": 0, "to": 1, "text": "down", "curviness": 20 },
    { "from": 1, "to": 0, "text": "up (moved)\nPOST", "curviness": 20 },
    { "from": 1, "to": 1, "text": "down", "curviness": -20 },
    { "from": 1, "to": 2, "text": "up (no move)" },
    { "from": 1, "to": 4, "text": "timer" },
    { "from": 2, "to": 0, "text": "timer\nPOST" },
    { "from": 2, "to": 3, "text": "down" },
    { "from": 3, "to": 0, "text": "up\nPOST\n(dblclick\nif no move)" },
    { "from": 3, "to": 3, "text": "down or timer", "curviness": 20 },
    { "from": 4, "to": 0, "text": "up\nPOST" },
    { "from": 4, "to": 4, "text": "down" }
  ]
}
*/

/*function criaJson(){
	var += "{ \"class\": \"go.GraphLinksModel\", \"nodeKeyProperty\": \"id\", \"nodeDataArray\": [";
	let i = 0;
	let x = 0;
	let y = 0;
	let ids = -1;
	for(i = 0; i < aut1.length-1; i++){
		var+="{ \"id\":" + ids + ", \"loc\": \"" + x + y + "\", \"text\": \"" + aut1[i] + "\" }";
		ids += 1;
		x += 20;
		y += 20;
	}
	var += "],\"linkDataArray\": [";
	

}*/

