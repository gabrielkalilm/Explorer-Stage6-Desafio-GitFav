import { GithubUser } from "./GithubUser.js"

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()

    //GithubUser.search('maykbrito').then(user => console.log(user))
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('Usuário já cadastrado')
      }

      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Usuário não encontrador!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch(error) {
      alert(error.message)
    }
  }

  delete(user){
    const filteredEntries = this.entries
    .filter((entry) => entry.login !== user.login)
    this.entries = filteredEntries
    this.update()
    this.save()
    location.reload()
  }
}

// classe que vai criar a visualização do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')
    
    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('#search-button')
    addButton.onclick = () => {
      const {value} = this.root.querySelector('#search')

      this.add(value)
    }
  }

  update(){
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.removeButton').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
        
        if(isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
      this.createNoneRow()
      
    })

  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <tr>
      <td class="user">
        <img src="./assets/Mayk Brito.svg" 
        alt="Imagem de Mayk Brito">
        <a href="https://github.com/diego3g" target="_blank">
          <p>Mayk Brito</p>
          <span>/maykbrito</span>
        </a>
      </td>
      <td class="repositories">120</td>
      <td class="followers">1234</td>
      <td>
        <button class="removeButton">Remover</button>
      </td>
    </tr>

    `
    return tr
  }
  
  removeAllTr() {
    
    this.tbody.querySelectorAll('tr')
    .forEach((tr) => {
      tr.remove()
    })
    
  }

  createNoneRow() {

    const noneRow = document.querySelector('tfoot')
    let verifyTbody = document.querySelector('tbody tr td')
    
    if(verifyTbody) {
      noneRow.classList.add('hidden')
      return
    } 
    else {
      noneRow.classList.remove('hidden')
      return
    }
  }

}
