const modal = {
  open() {
    document
      .querySelector(".modal-overlay") // acesso a classe da modal
      .classList.add("active"); // Adciono na classe o Active
    document
      .querySelector(".footer") // Tratamento de quando o modal estiver aberto ou fechado
      .classList.remove("habilitado") // Tratamento de quando o modal estiver aberto ou fechado
  },
  close() {
    document
      .querySelector(".modal-overlay") // acesso a classe da modal
      .classList.remove("active"); // Removendo a classe
    document
    document
      .querySelector(".footer") // Tratamento de quando o modal estiver aberto ou fechado
      .classList.add("habilitado")  // Tratamento de quando o modal estiver aberto ou fechado
    },
  };
  const Storage = {
    get() {
      
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}


// Criar funções de calculos.
const Transaction = {

  all: Storage.get(),
  
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
   //Responsavel por indexar a transação
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction,index);
    tr.dataset.index = index // Cada transação esta reebdno o seu index de array.
    DOM.transactionsContainer.appendChild(tr);
  },
  innerHTMLTransaction(transaction,index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense"; // Aqui foi criada uma constante e usando ternário seleciona a classe certa
    const amount = Utils.formatCurrency(transaction.amount); // Amount captura infomações da constante Utils
    const html = `
                <td class="description">${transaction.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                    <img onclick ="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
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
  formatAmount(value){
    value=Number(value)*100//Tratando dado que chegará com pontos ou virgula.

    return Math.round(value)// Arredondadno o número.
  },
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
  formatDate(date){// tratando dado para "separar" dados da string.
    const splittedDate = date.split("-")
    
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  }
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
    // Trim varre os campos e caso algum esteja vázio ele usa o Throw , que neste caso é um erro.
    if(description.trim()===""||
       amount.trim()===""||
       date.trim()===""){
          throw new Error("Por favor, preencha todos os campos")
    }
  },
  formatValues(){
    let { description, amount, date } = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return{
      description,
      amount,
      date
    }
  },
  clearFields(){
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },
    
  submit(event){// Quando o enviar for clicado tudas as funções são disparadas.
    event.preventDefault()
    try{
      //validação de campos
      Form.validateFields()
      //Salvando nova transação
      const transaction = Form.formatValues()
      Transaction.add(transaction)
      // Limpando os campos
      Form.clearFields()
      //Fechar o modal
      modal.close()

    } catch(error){// o Catch captura o erro e exibi na tela usando o alert.
      alert(error.message)
    }
  }
}
// Tratamento de informação para carregar na memória do navegador.
// Váriavel de controle de app.
const App = {
  init() {
    // Inicio
    Transaction.all.forEach(DOM.addTransaction)
      // Para cada Transação eu rodo a função transaction, meio que um "for" chique
      
   
    DOM.updateBalance()
    Storage.set(Transaction.all)
  },
  reload() {
    DOM.clearTransactions();
    App.init(); //Chamando o inicio novamente após adcionar uma nova transação.
  },
}

App.init()


