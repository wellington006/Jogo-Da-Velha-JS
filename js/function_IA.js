function gameModeConfig(gameMode) {
    document.getElementById('txGameMode').value = gameMode
    let btSingle = document.getElementById('sp')
    let btMulti = document.getElementById('mp')

    let selecionado = {
        back: 'rgb(0, 153, 255)',
        color: 'white',
        borderColor: 'white',
    }
    let padrao = {
        back: 'white',
        color: 'black',
        borderColor: 'rgb(0, 153, 255)'
    }

    if (gameMode == 'S') {
        btSingle.style.backgroundColor = selecionado.back
        btSingle.style.color = selecionado.color
        btSingle.style.borderColor = selecionado.borderColor
        btMulti.style.backgroundColor = padrao.back
        btMulti.style.color = padrao.color
        btMulti.style.borderColor = padrao.borderColor
    } else {
        btMulti.style.backgroundColor = selecionado.back
        btMulti.style.color = selecionado.color
        btMulti.style.borderColor = selecionado.borderColor
        btSingle.style.backgroundColor = padrao.back
        btSingle.style.color = padrao.color
        btSingle.style.borderColor = padrao.borderColor
    }
    clickStart()
}

function resetarPosicoes() {
    document.querySelectorAll('[pos]').forEach(posi => {
        posi.style.backgroundImage = null
    })
    document.getElementById('contador').value = 1    // Reseta contador
    document.getElementById('log').style.opacity = 0 // Esconde o gamelog
    jogadas = [] // Zera as jogadas realizadas

}

function clickStart() {
    historico = []
    document.getElementById('btRestart').style.opacity = 1; //Apresenta botão de restart
    document.getElementById('container').style.opacity = 1; // Desbloqueia o click nas posições

    setJogadores()
    resetarPosicoes()
}

function setJogadores() {
    let gameMode = document.getElementById('txGameMode').value
    let jogador1 = document.getElementById("jogador1")
    let jogador2 = document.getElementById("jogador2")

    jogador1.innerText = window.prompt('Digite o nome do jogador 1(X):') + ' (X)' // setar jogador 1

    if (gameMode == 'M') {
        jogador2.innerText = window.prompt('Digite o nome do jogador 2(O):') + ' (O)'
    } else {
        let adversarios = ['Gabriel [IA]', 'Lucas [IA]', 'David [IA]', 'Ana [IA]', 'Keila [IA]', 'Lúcia [IA]', 'Yasmin [IA]', 'Jasmin [IA]', 'Jonh [IA]', 'Jason [IA]']
        jogador2.innerText = adversarios[Math.floor((Math.random() * 11))] // Sorteia um adversário
    }

    document.getElementById('ptsJogador1').innerText = 0 // Zera a pontuação dos jogadores
    document.getElementById('ptsJogador2').innerText = 0
}

function incrementarPlacar(vencedor) {
    document.getElementById('log').style.opacity = 1 // Mostra gamelog
    let contJogada = document.getElementById('contador')

    if (vencedor == document.getElementById("jogador1").innerHTML) {
        document.getElementById('ptsJogador1').innerText = parseInt(document.getElementById('ptsJogador1').innerText) + 1 // Incrementa pontuação
        document.getElementById('log').innerText = `Parabéns ${document.getElementById('jogador1').innerText}!`
    } else {
        document.getElementById('ptsJogador2').innerText = parseInt(document.getElementById('ptsJogador2').innerText) + 1 // .toString()
        document.getElementById('log').innerText = `Parabéns ${document.getElementById('jogador2').innerText}!`
    }

    contJogada.value = 11
}

let jogadas = [] // Usar esse array como gabarito das jogadas
let historico = []

function jogada(clicado) {
    let gameMode = document.getElementById('txGameMode').value
    let contJogada = document.getElementById('contador')
    let posicao = document.getElementById(clicado)

    if (posicao.style.backgroundImage == '' && contJogada.value < 11) {
        if (contJogada.value % 2 == 0) { // Ímpar = X, Par = O
            if (gameMode == 'S') {
                clicado = jogadaIA() // Gera posicao a ser atribuida
                document.getElementById(clicado).style.backgroundImage = "url(./imagens/o.jpg)"
                jogadas[clicado.substring(3, 4)] = 'O' // O substring extrai o indice da pos
            } else {
                posicao.style.backgroundImage = "url(./imagens/o.jpg)"
                jogadas[clicado.substring(3, 4)] = 'O'
            }
        } else {
            posicao.style.backgroundImage = "url(./imagens/x.jpg)"
            jogadas[clicado.substring(3, 4)] = 'X'
        }

        let vencedor = checarVitoria(clicado) // Verifica se houve vitória

        if (vencedor != null) {  // Verifica se alguem venceu
            vencedor = vencedor == 'X' ? document.getElementById("jogador1").innerHTML : document.getElementById("jogador2").innerHTML

            historico.push({ vencedor: vencedor, partida: historico.length + 1 })
            incrementarPlacar(vencedor) // Incrementa e mostra o vencedor
        }

        if (contJogada.value > 8 && vencedor == null) {     // Verifica se deu velha
            document.getElementById('log').style.opacity = 1
            document.getElementById('log').innerText = 'Deu Velha!'
            contJogada.value = 11
            historico.push({ vencedor: 'Deu Velha', partida: historico.length + 1 })
        }

        contJogada.value = Number.parseInt(contJogada.value) + 1  // Contador de jogada

        if (gameMode == 'S' && vencedor != '') {   // Efetua um evento de click para simular a IA
            document.getElementById('pos0').click(jogada) // Passa posicao auxiliar para efetuar a jogada
        }

        vencedor = null
        refreshHistoric()
    }
}

function refreshHistoric() {
    let historic = document.getElementById('historico')
    historic.innerHTML = ''
    if (historico.length > 0) {
        historico.map(data => {
            historic.innerHTML += `<div style="margin: 3px;"><strong>Partida: ${data.partida}:</strong> ${data.vencedor}</div>`
        })
    }
}

function jogadaAleatoria() {
    let num
    let valido = false
    while (valido == false) {
        num = Math.floor(Math.random() * 10 + 1)
        if (jogadas[num] == undefined) {
            posicao = 'pos' + num
            return posicao
        }
    }
}

function jogadaIA() {
    let tipoJogada = 'O'
    let i                       // No primeiro loop se verifica-se a possibilidade de obter a vitoria

    const padraoDePosicoes = {
        padrao1: [1, 2, 3], // Coluna
        padrao2: [4, 5, 6],
        padrao3: [7, 8, 9],
        padrao4: [1, 4, 7], // Linha
        padroa5: [2, 5, 8],
        padrao6: [3, 6, 9],
        padrao7: [1, 5, 9], // Diagonal
        padrao8: [3, 5, 7]
    }

    let posicaoValida //Armazena a melhor posição obtido pelas comparações

    for (i = 0; i < 2; i++) { //No segundo loop se verifica-se a possibilidade de interceptar a vitoria de X
        // Verifica Possíveis vitórias
        Object.values(padraoDePosicoes).forEach(padrao => { // Percorre padrao por padrao efetuando comparações
            if (jogadas[padrao[0]] == undefined && jogadas[padrao[1]] == tipoJogada && jogadas[padrao[2]] == tipoJogada) {
                posicaoValida = `pos${padrao[0]}`
            }
            if (jogadas[padrao[0]] == tipoJogada && jogadas[padrao[1]] == undefined && jogadas[padrao[2]] == tipoJogada) {
                posicaoValida = `pos${padrao[1]}`
            }
            if (jogadas[padrao[0]] == tipoJogada && jogadas[padrao[1]] == tipoJogada && jogadas[padrao[2]] == undefined) {
                posicaoValida = `pos${padrao[2]}`
            }
        })

        if (posicaoValida) {
            return posicaoValida
        }

        tipoJogada = 'X' // Altera de buscar vitoria para buscar interceptação
    }

    // Possibilidade de antecipar a vitória
    tipoJogada = 'O'
    let num
    for (i = 0; i < 2; i++) {

        Object.values(padraoDePosicoes).forEach(padrao => {  // Percorre padrao por padrao efetuando comparações
            if (jogadas[padrao[0]] == tipoJogada && jogadas[padrao[1]] == undefined && jogadas[padrao[2]] == undefined) {
                num = Math.floor(Math.random() * 2)
                if (num == 0) {
                    posicaoValida = `pos${padrao[1]}` // Randomiza as possíveis jogadas
                } else {
                    posicaoValida = `pos${padrao[2]}`
                }
            }
            if (jogadas[padrao[0]] == undefined && jogadas[padrao[1]] == undefined && jogadas[padrao[2]] == tipoJogada) {
                num = Math.floor(Math.random() * 2)
                if (num == 0) {
                    posicaoValida = `pos${padrao[0]}`
                } else {
                    posicaoValida = `pos${padrao[1]}`
                }
            }
            if (jogadas[padrao[0]] == undefined && jogadas[padrao[1]] == tipoJogada && jogadas[padrao[2]] == undefined) {
                num = Math.floor(Math.random() * 2)
                if (num == 0) {
                    posicaoValida = `pos${padrao[0]}`
                } else {
                    posicaoValida = `pos${padrao[2]}`
                }
            }
        })

        if (posicaoValida) {
            return posicaoValida
        }

        tipoJogada = 'X'
    }
    return jogadaAleatoria()   // Se não encontrar nenhuma possibilidade    
}

function checarVitoria(clicado) { // Checa somente possiveis vitorias do jogador corrente
    let tipoJogada

    if (document.getElementById('contador').value % 2 == 1) {
        tipoJogada = 'X'
    } else {
        tipoJogada = 'O'
    }
    // Ordem de verificação:
    // Verifica possível vitória - Horizontal
    // Verifica possível vitória - Vertical
    // Verifica possível vitória - Diagonal (Exceto nas posições 2,4,6,8)

    switch (clicado) {
        case 'pos1':
            if (jogadas[1] == tipoJogada && jogadas[2] == tipoJogada && jogadas[3] == tipoJogada) {
                return tipoJogada
            }
            if (jogadas[1] == tipoJogada && jogadas[4] == tipoJogada && jogadas[7] == tipoJogada) {
                return tipoJogada
            }
            if (jogadas[1] == tipoJogada && jogadas[5] == tipoJogada && jogadas[9] == tipoJogada) {
                return tipoJogada
            }
            break
        case 'pos2':
            if (jogadas[1] == tipoJogada && jogadas[2] == tipoJogada && jogadas[3] == tipoJogada) {
                return tipoJogada
            }
            if (jogadas[2] == tipoJogada && jogadas[5] == tipoJogada && jogadas[8] == tipoJogada) {
                return tipoJogada
            }
            break
        case 'pos3':
            if (jogadas[1] == tipoJogada && jogadas[2] == tipoJogada && jogadas[3] == tipoJogada) {
                return tipoJogada
            }
            if (jogadas[3] == tipoJogada && jogadas[6] == tipoJogada && jogadas[9] == tipoJogada) {
                return tipoJogada
            }
            if (jogadas[3] == tipoJogada && jogadas[5] == tipoJogada && jogadas[7] == tipoJogada) {
                return tipoJogada
            }
            break
        case 'pos4':
            if (jogadas[4] == tipoJogada && jogadas[5] == tipoJogada && jogadas[6] == tipoJogada) {
                return tipoJogada
            }
            if (jogadas[1] == tipoJogada && jogadas[4] == tipoJogada && jogadas[7] == tipoJogada) {
                return tipoJogada
            }
            break
        case 'pos5':
            if (jogadas[4] == tipoJogada && jogadas[5] == tipoJogada && jogadas[6] == tipoJogada) {
                return tipoJogada
            }
            if (jogadas[2] == tipoJogada && jogadas[5] == tipoJogada && jogadas[8] == tipoJogada) {
                return tipoJogada
            }
            if (jogadas[3] == tipoJogada && jogadas[5] == tipoJogada && jogadas[7] == tipoJogada) {
                return tipoJogada
            }
            break
        case 'pos6':
            if (jogadas[4] == tipoJogada && jogadas[5] == tipoJogada && jogadas[6] == tipoJogada) {
                return tipoJogada
            }
            if (jogadas[3] == tipoJogada && jogadas[6] == tipoJogada && jogadas[9] == tipoJogada) {
                return tipoJogada
            }
            break
        case 'pos7':
            if (jogadas[7] == tipoJogada && jogadas[8] == tipoJogada && jogadas[9] == tipoJogada) {
                return tipoJogada
            }
            if (jogadas[1] == tipoJogada && jogadas[4] == tipoJogada && jogadas[7] == tipoJogada) {
                return tipoJogada
            }
            if (jogadas[3] == tipoJogada && jogadas[5] == tipoJogada && jogadas[7] == tipoJogada) {
                return tipoJogada
            }
            break
        case 'pos8':
            if (jogadas[7] == tipoJogada && jogadas[8] == tipoJogada && jogadas[9] == tipoJogada) {
                return tipoJogada
            }
            if (jogadas[2] == tipoJogada && jogadas[5] == tipoJogada && jogadas[8] == tipoJogada) {
                return tipoJogada
            }
            break
        case 'pos9':
            if (jogadas[7] == tipoJogada && jogadas[8] == tipoJogada && jogadas[9] == tipoJogada) {
                return tipoJogada
            }
            if (jogadas[3] == tipoJogada && jogadas[6] == tipoJogada && jogadas[9] == tipoJogada) {
                return tipoJogada
            }
            if (jogadas[1] == tipoJogada && jogadas[5] == tipoJogada && jogadas[9] == tipoJogada) {
                return tipoJogada
            }
            break
        default: return null
    }
}
