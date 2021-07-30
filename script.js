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

//Criar um Array de objetos com cada Transactions
const transactions = [ 
  {
    id: 1,
    description: "Luz",
    amount: -50000,
    date: "23/01/2021",
  },
  {
    id: 2,
    description: "Criação de Website",
    amount: 500000,
    date: "23/01/2021",
  },
  {
    id: 3,
    description: "Internet",
    amount: -20000,
    date: "23/01/2021",
  },
]

// Criar funções de calculos.
const Transaction = {
  incomes() {
    // Soma das entradas de valores
    let income = 0
    transactions.forEach(function(transactions) {// Para cada transactions roda a função
        if(transactions.amount>0){
            income += transactions.amount;
        }
    })
    return income
  },
  expenses() {
    // Soma das saídas de valores
    let saidas = 0
    transactions.forEach(function(transactions) {// Para cada transactions roda a função
        if(transactions.amount<0){
            saidas += transactions.amount;
        }
    })
    return saidas
  },
  total() {
    // Entradas - Saídas

    return Transaction.incomes()+Transaction.expenses()  
},
};
// Responsavel por criar na tela o HTML da nova Transação
const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'), 
  
  addTransaction(transaction,index){   
      console.log(`${transactions}`) //Responsavel por indexar a transação
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction)
    DOM.transactionsContainer.appendChild(tr)

  },
  innerHTMLTransaction(transaction) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense" // Aqui foi criada uma constante e usando ternário seleciona a classe certa
    const amount = Utils.formatCurrency(transaction.amount)// Amount captura infomações da constante Utils
    const html = `
                <td class="description">${transaction.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                    <img src="./assets/minus.svg" alt="Remover transação">
                </td>
                 `
                 return html
  },
  updateBalance(){// Pegando os display da tela
      document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
      document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
      document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
        }
}
const Utils = {
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""// Aqui usamos novamente o ternário para tratar o sinal.
        //Regex para formatar a Moeda
        value = String(value).replace(/\D/g,"")
        value = Number(value)/100// Tratando os número de inteiros para naturais
        value = value.toLocaleString("pt-br",{// Convertendo o valor para moeda brasileira
            style:"currency",
            currency: "BRL"
        })
        return signal + value
    }
}

transactions.forEach(function(transaction){// Para cada Transação eu rodo a função transaction, meio que um "for" chique
    DOM.addTransaction(transaction)
})
DOM.updateBalance()