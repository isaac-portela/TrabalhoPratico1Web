import { calculaQuantidadeEstrelas} from './export.js';

window.onload = () => {
  const id = window.location.search.replace('?id=', '');
  
  fetch(`https://fakestoreapi.com/products/${id}`)
  .then(res=>res.json())
  .then(produto => {
    const qtdEstrelas = Math.round(produto.rating.rate);
    const strEstrelas = calculaQuantidadeEstrelas(qtdEstrelas);
    let str = `
    <img src="${produto.image}" alt="${produto.title}" class="card-img-top">
    <div class="card-body">
      <h5 class="card-title">${produto.title}</h5>
      ${strEstrelas}
      <p class="card-text desc-det">${produto.description}</p>
      <p class="card-text price">$ ${produto.price}</p>
      <p class="card-text categoria">Categoria: ${produto.category}</p>
      <span class="comprar-carrinho-det"><button>Comprar</button><button>Carrinho</button></span>
    </div>
    `
    document.getElementById('detalhes').innerHTML = str;
  });
}