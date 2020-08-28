function reg() {
	str = document.getElementById('exp_reg').value;
	var regexp = new RegExp(str);
	var string = document.getElementById('texto').value;
	var result = regexp.test(string);
	if (result == true) {
		//alert('Expressão Válida');
		document.getElementById('texto').style.backgroundColor = "green";

	} else {
		//alert('Expressão Inválida!');
		document.getElementById('texto').style.backgroundColor = "red";
	}
}


function reg2() {
	str = document.getElementById('exp_reg').value;
	var regexp = new RegExp(str);
	var string = document.getElementById('texto2').value;
	var result = regexp.test(string);
	if (result == true) {
		//alert('Expressão Válida');
		document.getElementById('texto2').style.backgroundColor = "green";

	} else {
		//alert('Expressão Inválida!');
		document.getElementById('texto2').style.backgroundColor = "red";
	}
}
/*function check(){
	str = document.getElementById('exp_reg').value;
	var regexp = new RegExp(str);
	var string  = document.getElementById('text').value;
	var result = regexp.test(string);
	if(result == true){
		string.style.backgroundColor = "green";
	}else{
		string.style.backgroundColor = "red";
	}
}

function test(){
	alert('Passou');
}*/

var estados = [];
var transicoes = [];
var finais = [];
var cont = 0;

function insertExplicitConcatOperator(exp) {
	let output = '';

	for (let i = 0; i < exp.length; i++) {
		const token = exp[i];
		output += token;
		if (token === '(' || token === '|') {
			continue;
		}
		if (i < exp.length - 1) {
			const lookahead = exp[i + 1];

			if (lookahead === '*' || lookahead === '|' || lookahead === ')'|| lookahead === '+') {
				continue;
			}
			output += '.';
		}
	}
	return output;
};

function peek(stack) {
	return stack.length && stack[stack.length - 1];
}

const operatorPrecedence = {
	'|': 0,
	'.': 1,
	'*': 2,
	'+': 3
};

function toPostfix(exp) {
	let output = '';
	const operatorStack = [];

	for (const token of exp) {
		if (token === '.' || token === '|' || token === '*'|| token === '+') {
			while (operatorStack.length && peek(operatorStack) !== '('
				&& operatorPrecedence[peek(operatorStack)] >= operatorPrecedence[token]) {
				output += operatorStack.pop();
			}

			operatorStack.push(token);
		} else if (token === '(' || token === ')') {
			if (token === '(') {
				operatorStack.push(token);
			} else {
				while (peek(operatorStack) !== '(') {
					output += operatorStack.pop();
				}
				operatorStack.pop();
			}
		} else {
			output += token;
		}
	}

	while (operatorStack.length) {
		output += operatorStack.pop();
	}

	return output;
};

/*
  Thompson NFA Construction and Search.
*/

/*
  A state in Thompson's NFA can either have 
   - a single symbol transition to a state
	or
   - up to two epsilon transitions to another states
  but not both.   
*/
function createState(isEnd) {
	estados.push("Q" + cont);
	cont++;
	if (isEnd) finais.push(estados.length - 1);
	return (estados.length - 1);
}


/*
  Thompson's NFA state can have only one transition to another state for a given symbol.
*/
function addTransition(from, to, symbol) {
	transicoes.push([from, to, symbol]);
}

/*
  Construct an NFA that recognizes only the empty string.
*/
function fromEpsilon() {
	const start = createState(false);
	const end = createState(true);
	addTransition(start, end, '@');
	return { start, end };
}

/* 
   Construct an NFA that recognizes only a single character string.
*/
function fromSymbol(symbol) {
	const start = createState(false);
	const end = createState(true);
	addTransition(start, end, symbol);
	return { start, end };
}

/* 
   Concatenates two NFAs.
*/
function concat(first, second) {
	addTransition(first.end, second.start, '@');
	first.end.isEnd = false;
	return { start: first.start, end: second.end };
}

/* 
   Unions two NFAs.
*/
function union(first, second) {
	const start = createState(false);
	addTransition(start, first.start, '@');
	addTransition(start, second.start, '@');
	const end = createState(true);
	addTransition(first.end, end, '@');
	first.end.isEnd = false;
	addTransition(second.end, end, '@');
	second.end.isEnd = false;

	return { start, end };
}

/* 
   Apply Closure (Kleene's Star) on an NFA.
*/
function closure(nfa) {
	const start = createState(false);
	const end = createState(true);

	addTransition(start, end, '@');
	addTransition(start, nfa.start, '@');
	addTransition(nfa.end, end, '@');
	addTransition(nfa.end, nfa.start, '@');
	nfa.end.isEnd = false;
	return { start, end };
}

function oneOrMore(nfa) {
	const start = createState(false);
	const end = createState(true);

	addTransition(start, nfa.start, '@');
	addTransition(nfa.end, end, '@');
	addTransition(nfa.end, nfa.start, '@');
	nfa.end.isEnd = false;
	return { start, end };
}
/*
  Converts a postfix regular expression into a Thompson NFA.
*/
function toNFA(postfixExp) {
	if (postfixExp === '') {
		return fromEpsilon();
	}
	const stack = [];
	for (const token of postfixExp) {
		if (token === '+') {
			stack.push(oneOrMore(stack.pop()));
		} else if (token === '*') {
			stack.push(closure(stack.pop()));
		} else if (token === '|') {
			const right = stack.pop();
			const left = stack.pop();
			stack.push(union(left, right));
		} else if (token === '.') {
			const right = stack.pop();
			const left = stack.pop();
			stack.push(concat(left, right));
		} else {
			stack.push(fromSymbol(token));
		}
	}
	return stack.pop();
}


function createMatcher(exp) {
	const expWithConcatenationOperator = insertExplicitConcatOperator(exp);
	estados = [];
	transicoes = [];
	finais = [];
	cont = 0;
	// Generates an NFA using a stack
	const postfixExp = toPostfix(expWithConcatenationOperator);
	const nfa = toNFA(postfixExp);
	return nfa;
}

function ERtoAFND() {
	var er = document.getElementById('exp_reg').value;
	er = er.substr(1,er.length-2);
	console.log(er);
	const nfa = createMatcher(er);
	var est = JSON.stringify(estados);
	var tr = JSON.stringify(transicoes);
	sessionStorage.clear();
	sessionStorage.setItem('est', est );
	sessionStorage.setItem('tr', tr);
	sessionStorage.setItem('inicial', nfa.start);
	sessionStorage.setItem('final', nfa.end);
	window.open("fin_autom/index.html?remetente=expressao_r", "_blank");
}

function CapturaParametrosUrl() {
	var url = window.location.href;
	var res = url.split('?');

	if (res[1] !== undefined) {
	  var parametros = res[1].split('=');
	  if (parametros[0] == 'remetente' && parametros[1] == "automato") {
		var expressao = JSON.parse(sessionStorage.getItem('er'));
		document.getElementById('exp_reg').value = expressao;
	  }
	}
  }