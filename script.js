const modal = {
    open(){
        document
                .querySelector('.modal-overlay')// acesso a classe da modal
                .classList.add('active')// Adciono na classe o Active
    },
    close(){
        document
                .querySelector('.modal-overlay')// acesso a classe da modal
                .classList.remove('active')    }
}