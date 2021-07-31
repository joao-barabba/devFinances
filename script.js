const modal = {
  open() {
    document
      .querySelector(".modal-overlay") // acesso a classe da modal
      .classList.add("active"); // Adciono na classe o Active
  },
  close() {
    document
      .querySelector(".modal-overlay") // acesso a classe da modal
      .classList.remove("active"); // Removendo a classe
  },
};

// Criar funções de calculos.
const Transaction = {
  all: [
    {
      description: "Luz",
      amount: -50000,
      date: "23/01/2021",
    },
    {
      description: "Criação de Website",
      amount: 500000,
      date: "23/01/2021",
    },
    {
      description: "Internet",
      amount: -20000,
      date: "23/01/2021",
    },
  ], // Trazendo para ca pois no futuro  esta váriavel será salva no local storage do navegador.
  add(transaction) {
    Transaction.all.push(transaction);

    App.reload(); //Executa esta função de controle.
  },
  remove(index) {
    // Método para remoção de transação
    Transaction.all.splice(index, 1); // FUnção splice funciona para percorrer o array pelo index.

    App.reload(); //Executa a função.
  },
  incomes() {
    // Soma das entradas de valores
    let income = 0;
    Transaction.all.forEach(function (transactions) {
      // Para cada transactions roda a função
      if (transactions.amount > 0) {
        income += transactions.amount;
      }
    });
    return income;
  },
  expenses() {
    // Soma das saídas de valores
    let saidas = 0;
    Transaction.all.forEach(function (transactions) {
      // Para cada transactions roda a função
      if (transactions.amount < 0) {
        saidas += transactions.amount;
      }
    });
    return saidas;
  },
  total() {
    // Entradas - Saídas

    return Transaction.incomes() + Transaction.expenses();
  },
};

// Responsavel por criar na tela o HTML da nova Transação
const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
    console.log(`${Transaction.all}`); //Responsavel por indexar a transação
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction);
    DOM.transactionsContainer.appendChild(tr);
  },
  innerHTMLTransaction(transaction) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense"; // Aqui foi criada uma constante e usando ternário seleciona a classe certa
    const amount = Utils.formatCurrency(transaction.amount); // Amount captura infomações da constante Utils
    const html = `
                <td class="description">${transaction.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                    <img src="./assets/minus.svg" alt="Remover transação">
                </td>
                 `;
    return html;
  },
  updateBalance() {
    // Pegando os display da tela
    document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    );
    document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    );
    document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },
  clearTransactions() {
    DOM.transactionsContainer.innerHTML = "";
  },
};

//Tratando valores em R$
const Utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : ""; // Aqui usamos novamente o ternário para tratar o sinal.
    //Regex para formatar a Moeda
    value = String(value).replace(/\D/g, "");
    value = Number(value) / 100; // Tratando os número de inteiros para naturais
    value = value.toLocaleString("pt-br", {
      // Convertendo o valor para moeda brasileira
      style: "currency",
      currency: "BRL",
    });
    return signal + value;
  },
};

//Tratando dados inseridos no formulário.
const Form = {
description:document.querySelector('input#description'),// Pegando dados do form 
amount:document.querySelector('input#amount'),// Pegando dados do form  
date:document.querySelector('input#date'),// Pegando dados do form 

getValues(){// Recebdndo dados do form e colocando nesta função

  return{
    description: Form.description.value,
    amount: Form.amount.value,
    date: Form.date.value
  }
},
  validateFields(){
    const { description, amount, date } = Form.getValues()
  },
  submit(event){
    event.preventDefault()
    Form.validateFields()
  }
}

// Váriavel de controle de app.
const App = {
  init() {
    // Inicio
    Transaction.all.forEach(function (transaction) {
      // Para cada Transação eu rodo a função transaction, meio que um "for" chique
      DOM.addTransaction(transaction);
    });
    DOM.updateBalance();
  },
  reload() {
    DOM.clearTransactions();
    App.init(); //Chamando o inicio novamente após adcionar uma nova transação.
  },
};

App.init();

/*Transaction.add({
  // Local que irá adcionar novas transações
  description: "Salário",
  amount: 400000,
  date: "24/01/2021",
});*/
//Transaction.remove(0)//Chamando a função
