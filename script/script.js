
const calculaQuantidadeEstrelas = (qtdEstrelas) =>{
  let documentStar = '<div class="estrelas">';
  for(let i = 0; i < 5; i++){
    if(i < qtdEstrelas)
    documentStar += `<span class="estrela preenchida"></span>`;  
    else
    documentStar += `<span class="estrela"></span>`;
  }
  
  documentStar += '</div>';
  
  return documentStar;
}


const obterCategorias = async() => {
  try {
    const response = await fetch('https://fakestoreapi.com/products/categories');
    const categorias = await response.json();
    const arrayCategorias = categorias.map(categoria => categoria);
    return arrayCategorias;
  } catch (error) {
    console.log('Ocorreu um erro ao obter as categorias:', error);
  }
}

const redirecionarDetalhes = (id) =>{
  window.location.href = `./detalhes.html?id=${id}`;
}

const getAllProdutos = async() =>{
  const arrayCategorias = await obterCategorias();
  
  arrayCategorias.forEach(categoria => {
    fetch(`https://fakestoreapi.com/products/category/${categoria}`)
    .then(res=>res.json())
    .then(produtos => {
      produtos.forEach(produto => {
        const qtdEstrelas = Math.round(produto.rating.rate);
        const strEstrelas = calculaQuantidadeEstrelas(qtdEstrelas);
        
        let precoProduto = produto.price * 1.10;
        precoProduto = precoProduto.toFixed(2);
        
        let valorProdutoDozeVezes =(precoProduto * 1.10) / 12;
        valorProdutoDozeVezes = valorProdutoDozeVezes.toFixed(2);
        
        let str = `
          <div class="produto" onclick="redirecionarDetalhes('${produto.id}')">
            <img src="${produto.image}" alt="${produto.title}">
            <h3 class="title">${produto.title}</h3>
            ${strEstrelas}
            <p class="desc">${produto.description}</p>
            <p class="price">$ ${produto.price}</p>
            <span class="det-price"><strong>${precoProduto}</strong> ou <strong>12x</strong> de <strong>${valorProdutoDozeVezes}</strong></span>
            <span class="comprar-carrinho"><button>Comprar</button><button>Carrinho</button></span>
          </div>`
          document.getElementById(`${categoria.toLowerCase().replace(/\s/g, '').replace('\'', '')}`).innerHTML += str;
      })
      
    })
    
  });
}

const getProdutosMaisVisitados = async () => {
  try {
    const response = await fetch('https://fakestoreapi.com/products?sort=desc&limit=6');
    const produtosMaisVisitados = await response.json();
    produtosMaisVisitados.forEach(produto => {
      const qtdEstrelas = Math.round(produto.rating.rate);
      const strEstrelas = calculaQuantidadeEstrelas(qtdEstrelas);
      
      let str = `
      <div class="produto" onclick="redirecionarDetalhes('${produto.id}')">
        <img src="${produto.image}" alt="${produto.title}">
        <div class="content">
          <h3 class="title">${produto.title}</h3>
          ${strEstrelas}
          <p class="desc">${produto.description}</p>
          <p class="price">$ ${produto.price}</p>
          <span class="comprar-carrinho"><button>Comprar</button><button>Carrinho</button></span>
          </div>
      </div>`
      
      document.querySelector('.caixa-itens-mais-visitados').innerHTML += str;
    })
  }
  catch (error) {
    console.log('Ocorreu um erro ao obter produtos mais visitados', error);
  }
}

const redirecionaPesquisa = (search) => {
  window.location.href = `./pesquisa.html?${search}`;
}

window.onload = () => {
  getAllProdutos();
  getProdutosMaisVisitados();
  
  const pesquisa = document.getElementById('pesquisa-geral');
  const btnPesquisa = document.querySelector('.btn-search');
  
  pesquisa.addEventListener('keypress', (e) => {
    if(e.key === 'Enter'){
      const strSearch = `search=${pesquisa.value}`;
      redirecionaPesquisa(strSearch);
    }
  });
  
  btnPesquisa.addEventListener('click', () => {
    const selectCategoriaSelected = document.getElementById('filtro-categoria').value;
    let precoIni = document.getElementById('preco-ini').value;
    let precoFim = document.getElementById('preco-fim').value;
    
    precoIni = parseFloat(precoIni);
    precoFim = parseFloat(precoFim);
    
    if(precoIni && precoFim){
      if(precoIni > precoFim == true){
        alert('O preço inicial não pode ser maior que o preço final');
        return;
      }
    } 
    else{
      alert('Preencha os campos de preço');
      return;
    }
    
    const strSearch = `categoria=${selectCategoriaSelected}&precoIni=${precoIni}&precoFim=${precoFim}`;
    redirecionaPesquisa(strSearch);
  })
}
